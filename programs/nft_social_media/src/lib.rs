use anchor_lang::prelude::*;
use instructions::*;
pub mod errors;
pub mod instructions;
// pub mod pdas;
pub mod state;

declare_id!("4o1n5ZszsVuEwbHQuQtaZsfmEDgzjMPJKL4vDjNkCvW3");

#[program]
pub mod nft_social_media {
    use super::*;

    pub fn mint(ctx: Context<MintNft>) -> Result<()> {
        instructions::mint(ctx)
    }

    pub fn create_program_pda(ctx: Context<CreateProgramPda>, admin: Pubkey) -> Result<()> {
        instructions::admin::create_program_pda(ctx, admin)
    }

    pub fn add_mint_time(ctx: Context<Increase>) -> Result<()> {
        instructions::increase(ctx)
    }

    pub fn decrease_mint_time(ctx: Context<Decrease>) -> Result<()> {
        instructions::decrease(ctx)
    }

    pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
        instructions::create_post(ctx, content)
    }
    
    pub fn delete_post(ctx: Context<DeletePost>, post_id:u64) -> Result<()> {
        instructions::delete_post(ctx, post_id)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
