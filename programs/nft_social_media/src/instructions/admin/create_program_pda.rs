use crate::errors::ErrorCode;
use crate::state::ProgramPda;
use anchor_lang::prelude::*;

pub fn create_program_pda(ctx: Context<CreateProgramPda>, admin: Pubkey) -> Result<()> {
    let admin = admin;
    let program_pda = &mut ctx.accounts.program_admin_pda;

    let program_pda_bump = *ctx
        .bumps
        .get("program_admin_pda")
        .ok_or(ErrorCode::StakeBumpError)?;

    **program_pda = ProgramPda::init(admin, program_pda_bump);

    Ok(())
}

#[derive(Accounts)]
pub struct CreateProgramPda<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 85,
        seeds = [
            b"program_admin_pda",
            crate::ID.as_ref(),
            // payer.key().as_ref()
        ],
        bump
    )]
    pub program_admin_pda: Account<'info, ProgramPda>,
    pub system_program: Program<'info, System>,
}
