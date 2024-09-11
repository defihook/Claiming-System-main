use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Token, TokenAccount, Transfer },
};
use metaplex_token_metadata::state::{Metadata};


pub mod account;
pub mod error;
pub mod constants;

use account::*;
use error::*;
use constants::*;

declare_id!("3u19aUs9uQbe6mawUiifjetvtQkxLYzjF5ak1T6sCQXF");

#[program]
pub mod claiming {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _bump: u8) -> Result<()> {
        let global_authority = &mut ctx.accounts.global_authority;
        global_authority.super_admin = ctx.accounts.admin.key();
        Ok(())
    }

   
    pub fn airdrop(ctx: Context<Airdrop>, global_bump: u8, style: u8,  mint_time: i64) -> Result<()> {
        let mint_metadata = &mut &ctx.accounts.mint_metadata;

        msg!("Metadata Account: {:?}", ctx.accounts.mint_metadata.key());
        let (metadata, _) = Pubkey::find_program_address(
            &[
                metaplex_token_metadata::state::PREFIX.as_bytes(),
                metaplex_token_metadata::id().as_ref(),
                ctx.accounts.mint.key().as_ref(),
            ],
            &metaplex_token_metadata::id(),
        );
        require!(metadata == mint_metadata.key(), ClaimingError::InvalidMetadata);

        // verify metadata is legit
        let nft_metadata = Metadata::from_account_info(mint_metadata)?;

        if let Some(creators) = nft_metadata.data.creators {
            let mut valid: u8 = 0;
            let mut collection: Pubkey = Pubkey::default();
            for creator in creators {       
                if creator.address.to_string() == COLLECTION_ADDRESS && creator.verified == true {
                    valid = 1;
                    collection = creator.address;
                    break;
                }
            }
            require!(valid == 1, ClaimingError::UnkownOrNotAllowedNFTCollection);
            msg!("Collection= {:?}", collection);
        } else {
            return Err(error!(ClaimingError::MetadataCreatorParseError));
        };

        let airdrop_proof = &mut ctx.accounts.airdrop_proof;
        let timestamp = Clock::get()?.unix_timestamp;

        let mut _reward: u64 = 0;
        match style {
            1 => _reward = OG_REWARD,
            2 => _reward = PRIVATE_REWARD,
            3 => _reward = SPEC_REWARD,
            _ => _reward = 0,
        }

        airdrop_proof.owner = ctx.accounts.admin.key();
        airdrop_proof.mint = ctx.accounts.mint.key();
        airdrop_proof.claimed_time = timestamp;

        let total_amount: u64 = _reward * (timestamp - mint_time) as u64  / (PERIOD as u64) ;

        let token_account_info = &mut &ctx.accounts.user_token_account;
        let dest_token_account_info = &mut &ctx.accounts.dest_token_account;
        let token_program = &mut &ctx.accounts.token_program;
        let seeds = &[GLOBAL_AUTHORITY_SEED.as_bytes(), &[global_bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: dest_token_account_info.to_account_info().clone(),
            to: token_account_info.to_account_info().clone(),
            authority: ctx.accounts.global_authority.to_account_info()
        };
        token::transfer(
            CpiContext::new_with_signer(token_program.clone().to_account_info(), cpi_accounts, signer),
            total_amount
        )?;

        Ok(())
    }

    pub fn claim(ctx: Context<Claim>, global_bump: u8, style: u8,  receive_time: i64) -> Result<()> {
        let mint_metadata = &mut &ctx.accounts.mint_metadata;

        msg!("Metadata Account: {:?}", ctx.accounts.mint_metadata.key());
        let (metadata, _) = Pubkey::find_program_address(
            &[
                metaplex_token_metadata::state::PREFIX.as_bytes(),
                metaplex_token_metadata::id().as_ref(),
                ctx.accounts.mint.key().as_ref(),
            ],
            &metaplex_token_metadata::id(),
        );
        require!(metadata == mint_metadata.key(), ClaimingError::InvalidMetadata);

        // verify metadata is legit
        let nft_metadata = Metadata::from_account_info(mint_metadata)?;

        if let Some(creators) = nft_metadata.data.creators {
            let mut valid: u8 = 0;
            let mut collection: Pubkey = Pubkey::default();
            for creator in creators {       
                if creator.address.to_string() == COLLECTION_ADDRESS && creator.verified == true {
                    valid = 1;
                    collection = creator.address;
                    break;
                }
            }
            require!(valid == 1, ClaimingError::UnkownOrNotAllowedNFTCollection);
            msg!("Collection= {:?}", collection);
        } else {
            return Err(error!(ClaimingError::MetadataCreatorParseError));
        };
        let airdrop_proof = &mut ctx.accounts.airdrop_proof;
        require_keys_eq!(
            ctx.accounts.mint.key(),
            airdrop_proof.mint,
            ClaimingError::InvalidNFTAddress
        );

        let timestamp = Clock::get()?.unix_timestamp;

        let mut _start_time: i64 = 0;

        if receive_time >= airdrop_proof.claimed_time {
            _start_time = receive_time;
        } else {
            _start_time = airdrop_proof.claimed_time;
        }

        let mut _reward: u64 = 0;
        match style {
            1 => _reward = OG_REWARD,
            2 => _reward = PRIVATE_REWARD,
            3 => _reward = SPEC_REWARD,
            _ => _reward = 0,
        }

        let times: i64 = (timestamp - _start_time) / PERIOD;

        let token_account_info = &mut &ctx.accounts.user_token_account;
        let dest_token_account_info = &mut &ctx.accounts.dest_token_account;
        let token_program = &mut &ctx.accounts.token_program;
        let seeds = &[GLOBAL_AUTHORITY_SEED.as_bytes(), &[global_bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: dest_token_account_info.to_account_info().clone(),
            to: token_account_info.to_account_info().clone(),
            authority: ctx.accounts.global_authority.to_account_info()
        };
        token::transfer(
            CpiContext::new_with_signer(token_program.clone().to_account_info(), cpi_accounts, signer),
            _reward * times as u64
        )?;

        airdrop_proof.claimed_time = _start_time + times * PERIOD;
        airdrop_proof.owner = ctx.accounts.admin.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // The admin account is the first initailize account- the first payer's pubkey
    #[account(mut)]
    pub admin: Signer<'info>,

    // This is the account that made form the `GLOBAL_AUTHORITY_SEED` and programId
    #[account(
        init,
        seeds = [GLOBAL_AUTHORITY_SEED.as_ref()],
        bump,
        payer = admin,
        space = 8 + 40
    )]
    pub global_authority: Account<'info, GlobalPool>,
    // These are system and rent
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Airdrop<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [GLOBAL_AUTHORITY_SEED.as_ref()],
        bump,
    )]
    pub global_authority: Account<'info, GlobalPool>,
        
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    #[account(
        init,
        seeds = [mint.key().as_ref()],
        bump,
        space = 8 + 72,
        payer = admin
    )]
    pub airdrop_proof: Account<'info, AirdropProof>,

    #[account(
        mut,
        constraint = user_token_account.mint == REWARD_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
        constraint = user_token_account.owner == *admin.key,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = dest_token_account.mint == REWARD_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
        constraint = dest_token_account.owner == global_authority.key(),
    )]
    pub dest_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = mint_metadata.owner == &metaplex_token_metadata::ID
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint_metadata: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>
}


#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
        seeds = [GLOBAL_AUTHORITY_SEED.as_ref()],
        bump,
    )]
    pub global_authority: Account<'info, GlobalPool>,
        
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [mint.key().as_ref()],
        bump,
    )]
    pub airdrop_proof: Account<'info, AirdropProof>,

    #[account(
        mut,
        constraint = user_token_account.mint == REWARD_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
        constraint = user_token_account.owner == *admin.key,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = dest_token_account.mint == REWARD_TOKEN_MINT_PUBKEY.parse::<Pubkey>().unwrap(),
        constraint = dest_token_account.owner == global_authority.key(),
    )]
    pub dest_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = mint_metadata.owner == &metaplex_token_metadata::ID
    )]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub mint_metadata: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,

}