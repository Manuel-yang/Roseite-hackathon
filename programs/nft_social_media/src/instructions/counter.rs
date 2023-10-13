use crate::{errors::ErrorCode, state::ProgramPda};
use anchor_lang::prelude::*;
use serde_json::json;

pub fn increase(ctx: Context<Increase>) -> Result<()> {
    // only admin can invoke this function
    require!(
        ctx.accounts.payer.key() == ctx.accounts.program_admin_pda.admin,
        ErrorCode::InvalidAuthor
    );

    let counter_account = &mut ctx.accounts.counter_account;
    if counter_account.authority != ctx.accounts.user.key() {
        counter_account.authority = ctx.accounts.user.key()
    }
    let current_count = &counter_account.count;
    counter_account.count = if u64::MAX - current_count >= 1 {
        current_count.checked_add(1).unwrap()
    } else {
        u64::MAX
    };
    let log = json!({"Func":"addMintTime", "userAddress": ctx.accounts.user.key().to_string(),"currentMintTime": counter_account.count.to_string()});
    msg!("{}", serde_json::to_string_pretty(&log).unwrap());
    Ok(())
}

pub fn decrease(ctx: Context<Decrease>) -> Result<()> {
    // only admin can invoke this function
    require!(
        ctx.accounts.payer.key() == ctx.accounts.program_admin_pda.admin,
        ErrorCode::InvalidAuthor
    );

    let counter_account = &mut ctx.accounts.counter_account;
    if counter_account.authority != ctx.accounts.user.key() {
        counter_account.authority = ctx.accounts.user.key()
    }
    let current_count = &counter_account.count;
    counter_account.count = if current_count >= &1 {
        current_count.checked_sub(1).unwrap()
    } else {
        0
    };
    let log = json!({"Func":"decreaseMintTime", "userAddress": ctx.accounts.user.key().to_string(),"currentMintTime": counter_account.count.to_string()});
    msg!("{}", serde_json::to_string_pretty(&log).unwrap());
    Ok(())
}

#[derive(Accounts)]
pub struct Increase<'info> {
    // admin pda
    #[account(
        mut,
        seeds = [
            b"program_admin_pda",
            crate::ID.as_ref(),
        ],
        bump
    )]
    pub program_admin_pda: Account<'info, ProgramPda>,

    #[account(
      init_if_needed,
      payer = payer,
      space = 128,
      seeds = [b"counter_account", crate::ID.key().as_ref(), user.key().as_ref()],
      bump
    )]
    pub counter_account: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK:` doc comment explaining why no checks through types are necessary
    #[account(mut)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Decrease<'info> {
    // admin pda
    #[account(
        mut,
        seeds = [
            b"program_admin_pda",
            crate::ID.as_ref(),
        ],
        bump
    )]
    pub program_admin_pda: Account<'info, ProgramPda>,

    #[account(
    init_if_needed,
    payer = payer,
    space = 128,
    seeds = [b"counter_account", crate::ID.key().as_ref(), user.key().as_ref()],
    bump
  )]
    pub counter_account: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK:` doc comment explaining why no checks through types are necessary
    #[account(mut)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub authority: Pubkey,
}
