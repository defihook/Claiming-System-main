import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import { errorAlert, successAlert } from "../components/toastGroup";
import { IDL } from "./claiming";
import {
  AirdropProof,
  CLAIMING_PROGRAM_ID,
  GlobalPool,
  GLOBAL_AUTHORITY_SEED,
  MAJ_TOKEN_MINT,
} from "./type";
import {
  getAssociatedTokenAccount,
  getATokenAccountsNeedCreate,
  getMetadata,
  solConnection,
} from "./utils";

export const airdrop = async (
  wallet: WalletContextState,
  nfts: {
    mint: PublicKey;
    style: number;
    mintTime: number;
  }[],
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  let cloneWindow: any = window;
  if (!wallet.publicKey) return;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const userAddress = wallet.publicKey;
  const program = new anchor.Program(
    IDL as anchor.Idl,
    CLAIMING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let transactions: Transaction[] = [];
    for (let item of nfts) {
      const tx = await createAirdropTx(
        userAddress,
        item.mint,
        item.style,
        item.mintTime,
        program,
        solConnection
      );
      if (tx) {
        transactions.push(tx);
      }
    }
    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getRecentBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        closeLoading();
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      closeLoading();
    }
  } catch (error: any) {
    closeLoading();
    console.log(error);
    errorAlert(error?.message);
  }
};

export const claim = async (
  wallet: WalletContextState,
  nfts: {
    mint: PublicKey;
    style: number;
    receiveTime: number;
  }[],
  startLoading: Function,
  closeLoading: Function,
  updatePage: Function
) => {
  let cloneWindow: any = window;
  if (!wallet.publicKey) return;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const userAddress = wallet.publicKey;
  const program = new anchor.Program(
    IDL as anchor.Idl,
    CLAIMING_PROGRAM_ID,
    provider
  );
  try {
    startLoading();
    let transactions: Transaction[] = [];
    for (let item of nfts) {
      const tx = await createClaimTx(
        userAddress,
        item.mint,
        item.style,
        item.receiveTime,
        program,
        solConnection
      );
      if (tx) {
        transactions.push(tx);
      }
    }
    if (transactions.length !== 0) {
      let { blockhash } = await provider.connection.getRecentBlockhash(
        "confirmed"
      );
      transactions.forEach((transaction) => {
        transaction.feePayer = wallet.publicKey as PublicKey;
        transaction.recentBlockhash = blockhash;
      });
      if (wallet.signAllTransactions !== undefined) {
        const signedTransactions = await wallet.signAllTransactions(
          transactions
        );

        let signatures = await Promise.all(
          signedTransactions.map((transaction) =>
            provider.connection.sendRawTransaction(transaction.serialize(), {
              skipPreflight: true,
              maxRetries: 3,
              preflightCommitment: "confirmed",
            })
          )
        );
        await Promise.all(
          signatures.map((signature) =>
            provider.connection.confirmTransaction(signature, "finalized")
          )
        );
        closeLoading();
        successAlert("Transaction is confirmed!");
        updatePage();
      }
    } else {
      closeLoading();
    }
  } catch (error: any) {
    closeLoading();
    console.log(error);
    errorAlert(error?.message);
  }
};

export const createAirdropTx = async (
  userAddress: PublicKey,
  mint: PublicKey,
  style: number,
  mintTime: number,
  program: anchor.Program,
  connection: Connection
) => {
  console.log("mint", mint.toBase58());
  console.log("style", style);
  console.log("mintTime", mintTime);

  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    CLAIMING_PROGRAM_ID
  );
  const [airdropProof, _proof_bump] = await PublicKey.findProgramAddress(
    [mint.toBuffer()],
    CLAIMING_PROGRAM_ID
  );

  let destTokenAccount = await getAssociatedTokenAccount(
    globalAuthority,
    MAJ_TOKEN_MINT
  );
  let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [MAJ_TOKEN_MINT]
  );

  let tx = new Transaction();
  console.log("==>Airdropping to POX");
  console.log(instructions);
  if (instructions.length > 0) instructions.map((ix) => tx.add(ix));

  const metadata = await getMetadata(mint);

  tx.add(
    program.instruction.airdrop(bump, style, new anchor.BN(mintTime), {
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
      signers: [],
    })
  );

  return tx;
};

export const createClaimTx = async (
  userAddress: PublicKey,
  mint: PublicKey,
  style: number,
  receiveTime: number,
  program: anchor.Program,
  connection: Connection
) => {
  const [globalAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_AUTHORITY_SEED)],
    CLAIMING_PROGRAM_ID
  );

  const [airdropProof, _proof_bump] = await PublicKey.findProgramAddress(
    [mint.toBuffer()],
    CLAIMING_PROGRAM_ID
  );

  let destTokenAccount = await getAssociatedTokenAccount(
    globalAuthority,
    MAJ_TOKEN_MINT
  );
  let { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
    connection,
    userAddress,
    userAddress,
    [MAJ_TOKEN_MINT]
  );

  const state = await getAirdropState(mint);
  console.log("==?", state?.claimedTime.toNumber());

  let tx = new Transaction();
  if (instructions.length > 0) instructions.map((ix) => tx.add(ix));

  const metadata = await getMetadata(mint);

  console.log(metadata.toBase58(), "==>Claiming to POX");
  tx.add(
    program.instruction.claim(bump, style, new anchor.BN(receiveTime), {
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
      signers: [],
    })
  );

  return tx;
};

export const getAirdropInfo = async (mint: PublicKey) => {
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    CLAIMING_PROGRAM_ID,
    provider
  );
  const airdropInfo: AirdropProof | null = await getAirdropState(mint);
  if (airdropInfo)
    return {
      mint: airdropInfo.mint.toBase58(),
      owner: airdropInfo.owner.toBase58(),
      claimedTime: airdropInfo.claimedTime.toNumber(),
    };
};

export const getGlobalInfo = async () => {
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    CLAIMING_PROGRAM_ID,
    provider
  );
  const globalPool: GlobalPool | null = await getGlobalState(program);
  if (globalPool) {
    const result = {
      superAdmin: globalPool.superAdmin.toBase58(),
    };
    return result;
  }
};

export const getGlobalState = async (
  program: anchor.Program
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
};

export const getAirdropState = async (
  mint: PublicKey
): Promise<AirdropProof | null> => {
  let cloneWindow: any = window;
  let provider = new anchor.AnchorProvider(
    solConnection,
    cloneWindow["solana"],
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(
    IDL as anchor.Idl,
    CLAIMING_PROGRAM_ID,
    provider
  );
  const [airdropProof, _proof_bump] = await PublicKey.findProgramAddress(
    [mint.toBuffer()],
    CLAIMING_PROGRAM_ID
  );
  try {
    let airdropState = await program.account.airdropProof.fetch(airdropProof);
    return airdropState as unknown as AirdropProof;
  } catch {
    return null;
  }
};
