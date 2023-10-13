use super::counter::Counter;
use crate::errors::ErrorCode;
use crate::state::NftConfigPda;
use crate::state::ProgramPda;
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::associated_token;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token;
use anchor_spl::token::Token;
use mpl_candy_guard::cpi::accounts::MintV2;
use mpl_candy_guard::state::CandyGuard;
use mpl_candy_machine_core::CandyMachine;
use serde_json::json;
use solana_program::sysvar;

pub fn mint<'info>(ctx: Context<MintNft>) -> Result<()> {
    let payer_key = ctx.accounts.payer.key();
    let mint_key = ctx.accounts.nft_mint.key();

    if ctx.accounts.payer.key() != ctx.accounts.program_admin_pda.admin.key() {
        let counter_account = &mut ctx.accounts.counter_account;
        let current_count = &counter_account.count;
        msg!("Current mint times: {}", current_count);
        // require user has mint time
        require!(current_count > &0, ErrorCode::NotEnoughMintTime);
        // count minus one
        counter_account.count = current_count - 1;
    }

    let _ = cpi_mint(&ctx);

    let nft_config_pda = &mut ctx.accounts.nft_config_pda;

    let nft_config_pda_bump = *ctx
        .bumps
        .get("nft_config_pda")
        .ok_or(ErrorCode::StakeBumpError)?;

    **nft_config_pda = NftConfigPda::init(mint_key, payer_key, 0, 0, nft_config_pda_bump);
    let log = json!({"Func":"mint","nft_holder": nft_config_pda.nft_current_holder.to_string(),"fans_num": nft_config_pda.fans_num.to_string(), "posts_num": nft_config_pda.posts_num.to_string()});
    msg!("{}", serde_json::to_string_pretty(&log).unwrap());
    Ok(())
}

pub fn cpi_mint<'info>(ctx: &Context<MintNft>) -> Result<()> {
    system_program::create_account(
        // create account
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            system_program::CreateAccount {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.minter_authority.to_account_info(),
            },
        ),
        10000000, //lamports: u64
        82,       //space: u64 for size
        &ctx.accounts.token_program.key(),
    )?;

    token::initialize_mint(
        // init mint account
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::InitializeMint {
                mint: ctx.accounts.minter_authority.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        0, //zero decimals for the mint
        &ctx.accounts.payer.key(),
        Some(&ctx.accounts.payer.key()),
    )?;

    msg!("start to create ata");
    associated_token::create(
        // init ata account
        CpiContext::new(
            ctx.accounts.associated_token_program.to_account_info(),
            associated_token::Create {
                payer: ctx.accounts.payer.to_account_info(),
                associated_token: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
                mint: ctx.accounts.minter_authority.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
            },
        ),
    )?;

    token::mint_to(
        //mint nft to token_account
        CpiContext::new(
            ctx.accounts.associated_token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.minter_authority.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        1,
    )?;

    let program_admin_pda = &*ctx.accounts.program_admin_pda;
    let ProgramPda {
        program_pda_bump, ..
    } = **program_admin_pda;
    let program_pda_seed = &[
        &b"program_admin_pda"[..],
        crate::ID.as_ref(),
        &[program_pda_bump],
    ];
    let binding = &[&program_pda_seed[..]];
    let cpi = ctx.accounts.set_data_ctx().with_signer(binding);

    mpl_candy_guard::cpi::mint_v2(cpi, vec![0], Some("RSI".to_string()))?;
    Ok(())
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    // pda which can pass candy guard when invoking candy machine
    #[account(
        mut,
        seeds = [
            b"program_admin_pda",
            crate::ID.as_ref(),
        ],
        bump
    )]
    pub program_admin_pda: Box<Account<'info, ProgramPda>>,

    // pda which store the info of nft
    #[account(
        init_if_needed,
        payer=payer,
        space = 128,
        seeds = [
            b"nft_config_pda",
            nft_mint.key().as_ref(),
        ],
        bump
    )]
    pub nft_config_pda: Account<'info, NftConfigPda>,

    // mint time counter pda
    #[account(mut, constraint = counter_account.authority == payer.key() @ ErrorCode::InvalidPDA)]
    pub counter_account: Box<Account<'info, Counter>>,

    // address = Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g
    /// CHECK: account constraints checked in account trait
    #[account(address = mpl_candy_guard::id())]
    pub candy_guard_program: AccountInfo<'info>,

    // address = CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR
    /// CHECK: account constraints checked in account trait
    #[account(address = mpl_candy_machine_core::id())]
    pub candy_machine_program: AccountInfo<'info>,

    // candy guard address after deploying candy machine
    #[account(mut)]
    pub candy_guard: Box<Account<'info, CandyGuard>>,

    // candy machine address after deploying candy machine
    /// Candy machine account.
    #[account(mut, constraint = candy_guard.key() == candy_machine.mint_authority)]
    pub candy_machine: Box<Account<'info, CandyMachine>>,

    // authority of nft ata
    /// CHECK: account constraints checked in account trait
    // #[account(mut)]
    // pub ata_user: AccountInfo<'info>,

    /// Candy Machine authority account.
    ///
    /// CHECK: account constraints checked in CPI
    #[account(mut)]
    pub candy_machine_authority_pda: UncheckedAccount<'info>, // candy_machine_authority_pda

    /// Payer for the mint (SOL) fees.
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub minter_authority: Signer<'info>,

    /// Mint account of the NFT. The account will be initialized if necessary.
    ///
    /// Must be a signer if:
    ///   * the nft_mint account does not exist.
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub nft_mint: UncheckedAccount<'info>,

    /// Mint authority of the NFT before the authority gets transfer to the master edition account.
    ///
    /// If nft_mint account exists:
    ///   * it must match the mint authority of nft_mint.
    #[account(mut)]
    pub nft_mint_authority: Signer<'info>,

    /// Metadata account of the NFT. This account must be uninitialized.
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub nft_metadata: UncheckedAccount<'info>,

    /// Master edition account of the NFT. The account will be initialized if necessary.
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub nft_master_edition: UncheckedAccount<'info>,

    /// CHECK: doc comment explaining why no checks through types are necessary.
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,

    /// Collection authority or metadata delegate record.
    ///
    /// CHECK: account checked in CPI
    pub collection_delegate_record: UncheckedAccount<'info>,

    /// Mint account of the collection NFT.
    ///
    /// CHECK: account checked in CPI
    pub collection_mint: UncheckedAccount<'info>,

    /// Metadata account of the collection NFT.
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub collection_metadata: UncheckedAccount<'info>,

    /// Master edition account of the collection NFT.
    ///
    /// CHECK: account checked in CPI
    pub collection_master_edition: UncheckedAccount<'info>,

    /// Update authority of the collection NFT.
    ///
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub collection_update_authority: UncheckedAccount<'info>,

    /// Token Metadata program.
    ///
    /// CHECK: account checked in CPI
    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: UncheckedAccount<'info>,

    /// SPL Token program.
    pub token_program: Program<'info, Token>,

    /// SPL Associated Token program.
    pub associated_token_program: Program<'info, AssociatedToken>,

    /// System program.
    pub system_program: Program<'info, System>,

    /// Instructions sysvar account.
    ///
    /// CHECK: account constraints checked in account trait
    #[account(address = sysvar::instructions::id())]
    pub sysvar_instructions: UncheckedAccount<'info>,

    /// SlotHashes sysvar cluster data.
    ///
    /// CHECK: account constraints checked in account trait
    #[account(address = sysvar::slot_hashes::id())]
    pub recent_slothashes: UncheckedAccount<'info>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> MintNft<'info> {
    pub fn set_data_ctx(&self) -> CpiContext<'_, '_, '_, 'info, MintV2<'info>> {
        let cpi_accounts = MintV2 {
            candy_guard: self.candy_guard.to_account_info(),
            candy_machine_program: self.candy_machine_program.to_account_info(),
            candy_machine: self.candy_machine.to_account_info(),
            candy_machine_authority_pda: self.candy_machine_authority_pda.to_account_info(),
            payer: self.payer.to_account_info(),
            minter: self.program_admin_pda.to_account_info(),
            nft_mint: self.nft_mint.to_account_info(),
            nft_mint_authority: self.nft_mint_authority.to_account_info(),
            nft_metadata: self.nft_metadata.to_account_info(),
            nft_master_edition: self.nft_master_edition.to_account_info(),
            token: None,
            token_record: None,
            collection_delegate_record: self.collection_delegate_record.to_account_info(),
            collection_mint: self.collection_mint.to_account_info(),
            collection_metadata: self.collection_metadata.to_account_info(),
            collection_master_edition: self.collection_master_edition.to_account_info(),
            collection_update_authority: self.collection_update_authority.to_account_info(),
            token_metadata_program: self.token_metadata_program.to_account_info(),
            spl_ata_program: None,
            spl_token_program: self.token_program.to_account_info(),
            system_program: self.system_program.to_account_info(),
            sysvar_instructions: self.sysvar_instructions.to_account_info(),
            recent_slothashes: self.recent_slothashes.to_account_info(),
            authorization_rules: None,
            authorization_rules_program: None,
        };
        CpiContext::new(self.candy_guard_program.to_account_info(), cpi_accounts)
    }
}
