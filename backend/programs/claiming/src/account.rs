use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct GlobalPool {
    // 8 + 32
    pub super_admin: Pubkey,        // 32
}

#[account]
#[derive(Default)]
pub struct AirdropProof {
    // 8 + 72
    pub mint: Pubkey,               // 32
    pub owner: Pubkey,              // 32
    pub claimed_time: i64           // 8
}
