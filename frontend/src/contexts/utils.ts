import { web3 } from "@project-serum/anchor";
import { programs } from "@metaplex/js";
import { NETWORK, RPC_URL } from "../config";
import {
  BlockFetchedType,
  MAJ_TOKEN_MINT,
  TransactionFetchedType,
} from "./type";
import axios from "axios";
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  MintLayout,
} from "@solana/spl-token";

import FoxRarity from "../privateFoxRarity.json";
export const solConnection = new web3.Connection(RPC_URL);

export const getNftMetaData = async (nftMintPk: PublicKey) => {
  let {
    metadata: { Metadata },
  } = programs;
  let metadataAccount = await Metadata.getPDA(nftMintPk);
  const metadata = await Metadata.load(solConnection, metadataAccount);
  return metadata.data.data.uri;
};

export const getTier = (edition: number) => {
  const rarity: any = Object.values(FoxRarity);
  let tier = "";
  if (rarity && rarity.length !== 0) {
    tier = rarity.find((item: any) => parseInt(item.edition) === edition).tier;
  }
  return tier;
};

export const getMintDate = async (
  mint: string,
  walletAddress: string | null | undefined
) => {
  let mintDate = new Date().getTime();
  let receivedDate = new Date().getTime();
  let data: BlockFetchedType[] = [];
  await fetch(`https://public-api-test.solscan.io/account/transactions?account=${mint}&limit=200
  `)
    .then((resp) => resp.json())
    .then(async (json: BlockFetchedType[]) => {
      data = json;
      data = data.sort((a, b) => a.blockTime - b.blockTime);
      mintDate = data[0].blockTime * 1000;
      if (data?.length !== 0) {
        let splTransfers = data.filter(
          (item) => JSON.stringify(item).indexOf("spl-transfer") !== -1
        );
        // console.log(JSON.stringify(data), "data[i]");
        let splTransfersMG = data.filter(
          (item) =>
            JSON.stringify(item).indexOf(
              "NTYeYJ1wr4bpM5xo6zx5En44SvJFAd35zTxxNoERYqd"
            ) !== -1
        );
        let splTransfersSN = data.filter(
          (item) =>
            JSON.stringify(item).indexOf(
              "CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz"
            ) !== -1
        );
        splTransfers = splTransfers
          .concat(splTransfersMG)
          .concat(splTransfersSN);
        if (splTransfers?.length !== 0) {
          let transfersPrimise = [];
          for (let tx of splTransfers) {
            transfersPrimise.push(
              fetch(`https://public-api.solscan.io/transaction/${tx.txHash}`)
                .then((resp) => resp.json())
                .then((json: TransactionFetchedType) => {
                  return json;
                })
                .catch((error) => {
                  console.log(error);
                  return null;
                })
            );
          }
          const transfers = await Promise.all(transfersPrimise);
          if (walletAddress) {
            const nftTransfers: any[] = transfers.filter(
              (item) => JSON.stringify(item).indexOf(walletAddress) !== -1
            );
            if (nftTransfers && nftTransfers.length !== 0) {
              nftTransfers.sort((a, b) => b.blockTime - a.blockTime);
            }
            receivedDate = nftTransfers[0].blockTime * 1000;
          }
        }
      }
    })
    .catch((error) => {
      // console.log(error);
    });
  return { mintDate, receivedDate };
};

export const getTokenBalance = async (wallet: string) => {
  let balance = 0;
  try {
    const response = await axios({
      url: RPC_URL,
      method: "post",
      headers: { "Content-Type": "application/json" },
      data: [
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            wallet,
            {
              mint: MAJ_TOKEN_MINT,
            },
            {
              encoding: "jsonParsed",
            },
          ],
        },
      ],
    }).catch((error: any) => {
      console.log(error, "==> token balance error");
    });
    balance =
      response?.data[0].result.value[0].account.data.parsed.info.tokenAmount
        .uiAmount;
  } catch (error) {
    console.log(error);
  }
  return balance;
};

export const METAPLEX = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const getOwnerOfNFT = async (
  nftMintPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  let tokenAccountPK = await getNFTTokenAccount(nftMintPk, connection);
  let tokenAccountInfo = await connection.getAccountInfo(tokenAccountPK);

  console.log("nftMintPk=", nftMintPk.toBase58());
  console.log("tokenAccountInfo =", tokenAccountInfo);

  if (tokenAccountInfo && tokenAccountInfo.data) {
    let ownerPubkey = new PublicKey(tokenAccountInfo.data.slice(32, 64));
    console.log("ownerPubkey=", ownerPubkey.toBase58());
    return ownerPubkey;
  }
  return new PublicKey("");
};

export const getTokenAccount = async (
  mintPk: PublicKey,
  userPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  let tokenAccount = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 0,
          bytes: mintPk.toBase58(),
        },
      },
      {
        memcmp: {
          offset: 32,
          bytes: userPk.toBase58(),
        },
      },
    ],
  });
  return tokenAccount[0].pubkey;
};

export const getNFTTokenAccount = async (
  nftMintPk: PublicKey,
  connection: Connection
): Promise<PublicKey> => {
  let tokenAccount = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 64,
          bytes: "2",
        },
      },
      {
        memcmp: {
          offset: 0,
          bytes: nftMintPk.toBase58(),
        },
      },
    ],
  });
  return tokenAccount[0].pubkey;
};

export const getAssociatedTokenAccount = async (
  ownerPubkey: PublicKey,
  mintPk: PublicKey
): Promise<PublicKey> => {
  let associatedTokenAccountPubkey = (
    await PublicKey.findProgramAddress(
      [
        ownerPubkey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintPk.toBuffer(), // mint address
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
  return associatedTokenAccountPubkey;
};

export const getATokenAccountsNeedCreate = async (
  connection: Connection,
  walletAddress: PublicKey,
  owner: PublicKey,
  nfts: PublicKey[]
) => {
  let instructions = [],
    destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    const response = await connection.getAccountInfo(destinationPubkey);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        destinationPubkey,
        walletAddress,
        owner,
        mint
      );
      instructions.push(createATAIx);
    }
    destinationAccounts.push(destinationPubkey);
  }
  return {
    instructions,
    destinationAccounts,
  };
};

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

/** Get metaplex mint metadata account address */
export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [Buffer.from("metadata"), METAPLEX.toBuffer(), mint.toBuffer()],
      METAPLEX
    )
  )[0];
};

export const airdropSOL = async (
  address: PublicKey,
  amount: number,
  connection: Connection
) => {
  try {
    const txId = await connection.requestAirdrop(address, amount);
    await connection.confirmTransaction(txId);
  } catch (e) {
    console.log("Aridrop Failure", address.toBase58(), amount);
  }
};

export const createTokenMint = async (
  connection: Connection,
  payer: Keypair,
  mint: Keypair
) => {
  const ret = await connection.getAccountInfo(mint.publicKey);
  if (ret && ret.data) {
    console.log("Token already in use", mint.publicKey.toBase58());
    return;
  }
  // Allocate memory for the account
  const balanceNeeded = await Token.getMinBalanceRentForExemptMint(connection);
  const transaction = new Transaction();
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: balanceNeeded,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  transaction.add(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      9,
      payer.publicKey,
      payer.publicKey
    )
  );
  const txId = await connection.sendTransaction(transaction, [payer, mint]);
  await connection.confirmTransaction(txId);

  console.log("Tx Hash=", txId);
};

export const isExistAccount = async (
  address: PublicKey,
  connection: Connection
) => {
  try {
    const res = await connection.getAccountInfo(address);
    if (res && res.data) return true;
  } catch (e) {
    return false;
  }
};

export const getTokenAccountBalance = async (
  account: PublicKey,
  connection: Connection
) => {
  try {
    const res = await connection.getTokenAccountBalance(account);
    if (res && res.value) return res.value.uiAmount;
    return 0;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export const getNetworkTime = async () => {
  const slot = await solConnection.getSlot();
  const blockTime = await solConnection.getBlockTime(slot);
  return blockTime ? blockTime : Math.floor(new Date().getTime() / 1000);
};
