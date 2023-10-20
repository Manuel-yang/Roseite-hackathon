use crate::errors::ErrorCode;
use crate::state::{PostPda, ReviewPda};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

pub fn create_review_post(ctx: Context<CreateReviewPost>, content: String) -> Result<()> {
    let review_pda = &mut ctx.accounts.review_pda;
    let now_ts = Clock::get().unwrap().unix_timestamp;
    **review_pda = ReviewPda::init(ctx.accounts.nft_mint.key(),ctx.accounts.post_pda.review_num, ctx.accounts.post_pda.key(),content,0,0,now_ts);
    let _ = ctx.accounts.post_pda.increase_review_num();
    Ok(())
}

#[derive(Accounts)]
pub struct CreateReviewPost<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(mut)]
    pub post_pda: Account<'info, PostPda>,

    #[account(
        init_if_needed,
        payer=payer,
        space = 4000,
        seeds = [b"review_pda", post_pda.key().as_ref(), &post_pda.review_num.to_le_bytes()],
        bump
    )]
    pub review_pda: Account<'info, ReviewPda>,

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
        constraint = nft_token.amount == 1 @ ErrorCode::TokenAccountEmpty
      )]
    nft_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
}
