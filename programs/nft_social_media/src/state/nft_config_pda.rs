use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
#[account]
pub struct NftConfigPda {
    pub nft_mint: Pubkey,

    pub nft_current_holder: Pubkey,

    pub fans_num: u64,

    pub posts_num: u64,

    pub bump: u8,
}

impl NftConfigPda {
    pub fn init(
        nft_mint: Pubkey,
        nft_current_holder: Pubkey,
        fans_num: u64,
        posts_num: u64,
        bump: u8,
    ) -> Self {
        Self {
            nft_mint,
            nft_current_holder,
            fans_num,
            posts_num,
            bump,
        }
    }

    pub fn increase_fans_num(&mut self) -> Result<()> {
        self.fans_num = self
            .fans_num
            .checked_add(1)
            .ok_or(ErrorCode::ProgramAddError)?;
        Ok(())
    }

    pub fn decrease_fans_num(&mut self) -> Result<()> {
        self.fans_num = self
            .fans_num
            .checked_sub(1)
            .ok_or(ErrorCode::ProgramAddError)?;
        Ok(())
    }

    pub fn increase_posts_num(&mut self) -> Result<()> {
        self.posts_num = self
            .posts_num
            .checked_add(1)
            .ok_or(ErrorCode::ProgramAddError)?;
        Ok(())
    }

    pub fn decrease_posts_num(&mut self) -> Result<()> {
        self.posts_num = self
            .posts_num
            .checked_sub(1)
            .ok_or(ErrorCode::ProgramAddError)?;
        Ok(())
    }
}
