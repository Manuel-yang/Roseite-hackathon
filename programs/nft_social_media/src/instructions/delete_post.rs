use crate::errors::ErrorCode;
use crate::state::{NftConfigPda, PostPda};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

pub fn delete_post(ctx: Context<DeletePost>, _post_id: u64) -> Result<()> {
    let _ = ctx.accounts.post_pda.update_post_pda_status(1);
    Ok(())
}

#[derive(Accounts)]
#[instruction(_post_id:u64)]
pub struct DeletePost<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(mut)]
    nft_config_pda: Account<'info, NftConfigPda>,

    #[account(
        mut,
        seeds = [b"post_pda",nft_config_pda.nft_mint.as_ref(), &_post_id.to_le_bytes()],
        // close = payer,
        bump
    )]
    pub post_pda: Account<'info, PostPda>,

    // nft mint address
    #[account(
        mint::decimals = 0,
        constraint = nft_mint.supply == 1 @ ErrorCode::TokenNotNFT
      )]
    nft_mint: Account<'info, Mint>,

    // nft token address
    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = payer,
        constraint = nft_token.amount == 1 @ ErrorCode::TokenAccountEmpty,
      )]
    nft_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
}
