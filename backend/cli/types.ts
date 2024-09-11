import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const CLAIMING_PROGRAM_ID = new PublicKey("3u19aUs9uQbe6mawUiifjetvtQkxLYzjF5ak1T6sCQXF");
export const POX_TOKEN_MINT = new PublicKey("H3rmqbVz8NTCkGABeue3yc9PgioL2i1RPrQM45itdKMu");
export const POX_TOKEN_DECIMAL = 1_000_000_000; 

export interface GlobalPool {
    // 8 + 32
    superAdmin: PublicKey,          // 32
}

export interface AirdropProof {
    mint: PublicKey,            // 32
    owner: PublicKey,           // 32
    claimedTime: anchor.BN,     // 8
}
