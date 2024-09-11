import { Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import fs from 'fs';
import path from 'path';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

import { IDL as StakingIDL } from "../target/types/claiming";
import {
    Keypair,
    PublicKey,
    Connection,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
} from '@solana/web3.js';
import {
    CLAIMING_PROGRAM_ID,
    GLOBAL_AUTHORITY_SEED,
    GlobalPool,
    POX_TOKEN_MINT,
    AirdropProof,
} from './types';
import {
    getAssociatedTokenAccount,
    getATokenAccountsNeedCreate,
    getNFTTokenAccount,
    getOwnerOfNFT,
    getMetadata,
    METAPLEX,
    isExistAccount,
} from './utils';

let program: Program = null;

// Address of the deployed program.
let programId = new anchor.web3.PublicKey(CLAIMING_PROGRAM_ID);

anchor.setProvider(anchor.AnchorProvider.local(web3.clusterApiUrl("devnet")));
const solConnection = anchor.getProvider().connection;
const payer = anchor.AnchorProvider.local().wallet;

// Generate the program client from IDL.
program = new anchor.Program(StakingIDL as anchor.Idl, programId);
console.log('ProgramId: ', program.programId.toBase58());


const main = async () => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    console.log('GlobalAuthority: ', globalAuthority.toBase58());

    // await initProject();

    // console.log(await getAirdropState(new PublicKey("HYX4tS54K7d5SEtTRvwsFD5h8EamtiQqdfewX8ixQeDa"), program));
    // await airdrop(new PublicKey("wcaCWTdZSHPoK9i6uAjkchrJ7tCqtqxvF9sha9F9Fdf"), 1, 1663677057);
   
    await claim(new PublicKey("wcaCWTdZSHPoK9i6uAjkchrJ7tCqtqxvF9sha9F9Fdf"), 1, 1663676057)
};

/**
 * Initialize the project
 */
export const initProject = async (
) => {
    const tx = await createInitializeTx(payer.publicKey, program);
    const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = blockhash;
    payer.signTransaction(tx);
    let txId = await solConnection.sendTransaction(tx, [(payer as NodeWallet).payer]);
    await solConnection.confirmTransaction(txId, "confirmed");
    console.log("txHash =", txId);
}

/**
 * Airdrop the $POX to the users wallet
 * @param mint The NFT mint address
 * @param style The tier style as number 1: OG, 2: Private, 3: Special
 * @param mintTime The mint timestamp of this NFT
 */
export const airdrop = async (
    mint: PublicKey,
    style: number,
    mintTime: number
) => {
    const tx = await createAirdropTx(payer.publicKey, mint, style, mintTime, program, solConnection);
    const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = blockhash;
    payer.signTransaction(tx);
    let txId = await solConnection.sendTransaction(tx, [(payer as NodeWallet).payer]);
    await solConnection.confirmTransaction(txId, "confirmed");
    console.log("txHash =", txId);
}

/**
 * Claim $POX to the users wallet
 * @param mint The NFT mint address
 * @param style The tier style as number 1: OG, 2: Private, 3: Special
 * @param receiveTime This NFT's receive time when it comes to this wallet
 */
export const claim = async (
    mint: PublicKey,
    style: number,
    receiveTime: number
) => {
    const tx = await createClaimTx(payer.publicKey, mint, style, receiveTime, program, solConnection);
    const { blockhash } = await solConnection.getRecentBlockhash('confirmed');
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = blockhash;
    payer.signTransaction(tx);
    let txId = await solConnection.sendTransaction(tx, [(payer as NodeWallet).payer]);
    await solConnection.confirmTransaction(txId, "confirmed");
    console.log("txHash =", txId);
}


export const createInitializeTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        CLAIMING_PROGRAM_ID,
    );

    let tx = new Transaction();
    console.log('==>Initializing Program');

    tx.add(program.instruction.initialize(
        bump, {
        accounts: {
            admin: userAddress,
            globalAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
        },
        instructions: [],
        signers: [],
    }));

    return tx;
}

export const createAirdropTx = async (
    userAddress: PublicKey,
    mint: PublicKey,
    style: number,
    mintTime: number,
    program: anchor.Program,
    connection: Connection,
) => {
    
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        CLAIMING_PROGRAM_ID,
    );
    const [airdropProof, _proof_bump] = await PublicKey.findProgramAddress(
        [mint.toBuffer()],
        CLAIMING_PROGRAM_ID,
    );

    let destTokenAccount = await getAssociatedTokenAccount(globalAuthority, POX_TOKEN_MINT);
    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        userAddress,
        [POX_TOKEN_MINT]
    );

    let tx = new Transaction();
    console.log('==>Airdropping to POX');
    console.log(instructions);
    if (instructions.length > 0) instructions.map((ix) => tx.add(ix));

    const metadata = await getMetadata(mint);

    tx.add(program.instruction.airdrop(
        bump, style, new anchor.BN(mintTime), {
            accounts: {
                admin: userAddress,
                globalAuthority,
                mint,
                airdropProof,
                userTokenAccount: destinationAccounts[0],
                destTokenAccount,
                mintMetadata: metadata,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            },
            instructions: [],
            signers: []
        }
    ));

    return tx;
}

export const createClaimTx = async (
    userAddress: PublicKey,
    mint: PublicKey,
    style: number,
    receiveTime: number,
    program: anchor.Program,
    connection: Connection,
) => {
    
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        CLAIMING_PROGRAM_ID,
    );

    const [airdropProof, _proof_bump] = await PublicKey.findProgramAddress(
        [mint.toBuffer()],
        CLAIMING_PROGRAM_ID,
    );

    let destTokenAccount = await getAssociatedTokenAccount(globalAuthority, POX_TOKEN_MINT);
    let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        connection,
        userAddress,
        userAddress,
        [POX_TOKEN_MINT]
    );

    let tx = new Transaction();
    console.log('==>Claiming to POX');
    if (instructions.length > 0) instructions.map((ix) => tx.add(ix));

    const metadata = await getMetadata(mint);

    tx.add(program.instruction.claim(
        bump, style, new anchor.BN(receiveTime), {
            accounts: {
                admin: userAddress,
                globalAuthority,
                mint,
                airdropProof,
                userTokenAccount: destinationAccounts[0],
                destTokenAccount,
                mintMetadata: metadata,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            instructions: [],
            signers: []
        }
    ));

    return tx;
}
export const getAirdropInfo = async (
    mint: PublicKey,
) => {
    const airdropInfo: AirdropProof = await getAirdropState(mint, program);
    return {
        mint: airdropInfo.mint.toBase58(),
        owner: airdropInfo.owner.toBase58(),
        claimedTime: airdropInfo.claimedTime.toNumber()
    };
}

export const getGlobalInfo = async () => {
    const globalPool: GlobalPool = await getGlobalState(program);
    const result = {
        superAdmin: globalPool.superAdmin.toBase58(),
    };
    return result;
}

export const getGlobalState = async (
    program: anchor.Program,
): Promise<GlobalPool | null> => {
    const [globalAuthority, _] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        CLAIMING_PROGRAM_ID
    );
    try {
        let globalState = await program.account.globalPool.fetch(globalAuthority);
        return globalState as unknown as GlobalPool;
    } catch {
        return null;
    }
}

export const getAirdropState = async (
    mint: PublicKey,
    program: anchor.Program,
): Promise<AirdropProof | null> => {
    const [airdropProof, _proof_bump] = await PublicKey.findProgramAddress(
        [mint.toBuffer()],
        CLAIMING_PROGRAM_ID,
    );
    try {
        let airdropState = await program.account.airdropProof.fetch(airdropProof);
        return airdropState as unknown as AirdropProof;
    } catch {
        return null;
    }
}

main();