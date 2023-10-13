use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Fee should be <= 10000")]
    ErrFeeShouldLowerOrEqualThan10000,
    #[msg("Insufficient funs for transaction")]
    InsufficientFundsForTransaction,
    #[msg("The price is lower than the current bid")]
    PriceIsTooLow,
    #[msg("Exceed max auction time")]
    ExceedMaxAuctionTime,
    #[msg("Auction has expired")]
    AuctionHasExpired,
    #[msg("Auction settlement")]
    AuctionSettlement,
    #[msg("Not fixed price order")]
    NotFixedPriceOrder,
    #[msg("Incorrect parameter")]
    IncorrectParameter,
    #[msg("No offer now")]
    NoOfferNow,
    #[msg("Not part of collection")]
    NotPartOfCollection,
    #[msg("AccountNotInitialized")]
    NotInitialized,
    #[msg("Exceed max bidder num")]
    ExceedMaxBidderNum,
    #[msg("unable to get stake details bump")]
    StakeBumpError,
    #[msg("the given token account has no token")]
    TokenAccountEmpty,
    #[msg("the given mint account doesn't belong to NFT")]
    TokenNotNFT,
    #[msg("the staking is not currently active")]
    StakingInactive,
    #[msg("unable to get nft record bump")]
    NftBumpError,
    #[msg("unable to add the given values")]
    ProgramAddError,
    #[msg("unable to subtract the given values")]
    ProgramSubError,
    #[msg("Mint time is not enough")]
    NotEnoughMintTime,
    #[msg("PDA is not valid")]
    InvalidPDA,
    #[msg("original owner is not the staker")]
    InvalidOriginalOwner,
    #[msg("current nft is locked")]
    NftIsLock,
    #[msg("you are not author")]
    InvalidAuthor,
    #[msg("Invalid burn array in compound")]
    InvalidBurnArray,
    #[msg("Invalid input")]
    InvalidInput,
    #[msg("You are not super admin")]
    InvalidSuperAdmin,
}
