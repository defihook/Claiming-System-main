import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const GLOBAL_AUTHORITY_SEED = "global-authority";

export const CLAIMING_PROGRAM_ID = new PublicKey(
  "E2eypZ4bbyC8zKWYSvCZgNNDszE3MXgnuyceNv77pYLA"
);
export const MAJ_TOKEN_MINT = new PublicKey(
  "8pMABk7S2E28X1FkxzNHWEJBt1WTwUrxfRZBuR13K78c"
);
export const MAJ_TOKEN_DECIMAL = 1_000_000_000;

export interface GlobalPool {
  // 8 + 32
  superAdmin: PublicKey; // 32
}

export interface AirdropProof {
  mint: PublicKey; // 32
  owner: PublicKey; // 32
  claimedTime: anchor.BN; // 8
}
export interface GlobalPool {
  superAdmin: PublicKey;
}

export interface FoxNFT {
  mint: string;
  tier: string;
  image: string;
  name: string;
  uri: string;
  mintData: number;
}

export interface BlockFetchedType {
  blockTime: number;
  fee: number;
  includeSPLTransfer: boolean;
  lamport: number;
  parsedInstruction:
    | {
        program?: string;
        programId?: string;
        type?: string;
      }[]
    | null;
  signer: any;
  slot: number;
  status: string;
  txHash: string;
}

export interface TransactionFetchedType {
  blockTime: 1665582121;
  slot: 154963885;
  txHash: "21Dv9TnDMdAbsoqZgLhwPCcLh3r9hbVWBtzRZwyKGKNjvGepP3TprkEeDVzexd85yJEs27FjHBWoSwKimUkXfnFT";
  fee: 5000;
  status: "Success";
  lamport: 0;
  signer: ["2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL"];
  logMessage: [string[]];
  inputAccount: [
    {
      account: "2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL";
      signer: true;
      writable: true;
      preBalance: 155025840;
      postBalance: 152981560;
    },
    {
      account: "73YYhKxn4ZUwShWXvbZtZ5Uj8EivFJ9JKyJA1pin2iyt";
      signer: false;
      writable: true;
      preBalance: 2039280;
      postBalance: 2039280;
    },
    {
      account: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
      signer: false;
      writable: true;
      preBalance: 0;
      postBalance: 2039280;
    },
    {
      account: "11111111111111111111111111111111";
      signer: false;
      writable: false;
      preBalance: 1;
      postBalance: 1;
    },
    {
      account: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
      signer: false;
      writable: false;
      preBalance: 1461600;
      postBalance: 1461600;
    },
    {
      account: "A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu";
      signer: false;
      writable: false;
      preBalance: 93934955;
      postBalance: 93934955;
    },
    {
      account: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
      signer: false;
      writable: false;
      preBalance: 731913600;
      postBalance: 731913600;
    },
    {
      account: "DeJBGdMFa1uynnnKiwrVioatTuHmNLpyFKnmB5kaFdzQ";
      signer: false;
      writable: false;
      preBalance: 1141440;
      postBalance: 1141440;
    },
    {
      account: "SysvarRent111111111111111111111111111111111";
      signer: false;
      writable: false;
      preBalance: 1009200;
      postBalance: 1009200;
    },
    {
      account: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
      signer: false;
      writable: false;
      preBalance: 934087680;
      postBalance: 934087680;
    }
  ];
  recentBlockhash: "4zEgndRRoLUBBuMeHqvoogZLpTmMmsKz4WRRh6C18TQH";
  innerInstructions: [
    {
      index: 1;
      parsedInstructions: [
        {
          programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
          program: "spl-token";
          type: "getAccountDataSize";
          name: "getAccountDataSize";
          params: {
            extensionTypes: ["immutableOwner"];
            mint: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
          };
        },
        {
          programId: "11111111111111111111111111111111";
          program: "system";
          type: "createAccount";
          name: "Create Account";
          params: {
            newAccount: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
            source: "2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL";
            "transferAmount(SOL)": 0.00203928;
            programOwner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
          };
        },
        {
          programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
          program: "spl-token";
          type: "initializeImmutableOwner";
          name: "initializeImmutableOwner";
          params: {
            account: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
          };
        },
        {
          programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
          program: "spl-token";
          type: "initializeAccount3";
          name: "initializeAccount3";
          params: {
            account: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
            mint: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
            owner: "A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu";
          };
        }
      ];
    }
  ];
  tokenBalanes: [
    {
      account: "73YYhKxn4ZUwShWXvbZtZ5Uj8EivFJ9JKyJA1pin2iyt";
      amount: {
        postAmount: "0";
        preAmount: "1";
      };
      token: {
        decimals: 0;
        tokenAddress: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
      };
    },
    {
      account: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
      amount: {
        postAmount: "1";
        preAmount: 0;
      };
      token: {
        decimals: 0;
        tokenAddress: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
      };
    }
  ];
  parsedInstruction: [
    {
      programId: "DeJBGdMFa1uynnnKiwrVioatTuHmNLpyFKnmB5kaFdzQ";
      type: "Unknown";
      data: "0000000000000000000000000000000000000000000000000000000000000000";
      dataEncode: "11111111111111111111111111111111";
      name: "Instruction 0";
      params: {
        Account0: "A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu";
      };
    },
    {
      programId: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
      program: "spl-associated-token-account";
      type: "createAssociatedAccount";
      data: "";
      dataEncode: "";
      name: "Create Associated Account";
      params: {
        authority: "2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL";
        associatedAccount: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
        tokenAddress: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
        tokenProgramId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
      };
    },
    {
      programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
      program: "spl-token";
      type: "spl-transfer-checked";
      name: "Token transfer";
      params: {
        source: "73YYhKxn4ZUwShWXvbZtZ5Uj8EivFJ9JKyJA1pin2iyt";
        destination: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
        authority: "2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL";
        amount: "1";
        mint: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
      };
      extra: {
        source: "73YYhKxn4ZUwShWXvbZtZ5Uj8EivFJ9JKyJA1pin2iyt";
        destination: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
        authority: "2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL";
        amount: "1";
        mint: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
        tokenAddress: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
        decimals: 0;
        sourceOwner: "2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL";
        destinationOwner: "A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu";
      };
    }
  ];
  confirmations: null;
  version: "legacy";
  tokenTransfers: [
    {
      source: "73YYhKxn4ZUwShWXvbZtZ5Uj8EivFJ9JKyJA1pin2iyt";
      destination: "EzdyPkngzYgiNcxWjZsNHXLCWvrekg5HEkNjnu4BVqHG";
      source_owner: "2HapWhnUUq2X1WhufqnuoVST4SgxZmTZepvMfioKVyNL";
      destination_owner: "A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu";
      amount: "1";
      token: {
        address: "9kCuh9Yrdg2o17e9xR6PYi5ui3jqPsbW7gHJHB6MiPhv";
        decimals: 0;
      };
      type: "spl-transfer-checked";
    }
  ];
  solTransfers: [];
  serumTransactions: [];
  raydiumTransactions: [];
  unknownTransfers: [];
}
