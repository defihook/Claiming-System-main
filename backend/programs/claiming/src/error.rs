use anchor_lang::prelude::*;

#[error_code]
pub enum ClaimingError {
    #[msg("Invalid Super Owner")]
    InvalidSuperOwner,
    #[msg("Invalid Global Pool Address")]
    InvalidGlobalPool,
    #[msg("Invalid User Pool Owner Address")]
    InvalidUserPool,

    #[msg("Invalid Withdraw Time")]
    InvalidWithdrawTime,
    #[msg("Not Found Staked Mint")]
    InvalidNFTAddress,

    #[msg("Insufficient Reward Token Balance")]
    InsufficientRewardVault,
    #[msg("Insufficient Account Token Balance")]
    InsufficientAccountVault,

    #[msg("Invalid Metadata Address")]
    InvalidMetadata,
    #[msg("Can't Parse The NFT's Creators")]
    MetadataCreatorParseError,
    #[msg("Unknown Collection Or The Collection Is Not Allowed")]
    UnkownOrNotAllowedNFTCollection,
}