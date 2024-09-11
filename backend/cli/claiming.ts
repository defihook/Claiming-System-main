export type Claiming = {
  "version": "0.1.0",
  "name": "claiming",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "airdrop",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "airdropProof",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "style",
          "type": "u8"
        },
        {
          "name": "mintTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "airdropProof",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "style",
          "type": "u8"
        },
        {
          "name": "receiveTime",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "airdropProof",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "claimedTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidSuperOwner",
      "msg": "Invalid Super Owner"
    },
    {
      "code": 6001,
      "name": "InvalidGlobalPool",
      "msg": "Invalid Global Pool Address"
    },
    {
      "code": 6002,
      "name": "InvalidUserPool",
      "msg": "Invalid User Pool Owner Address"
    },
    {
      "code": 6003,
      "name": "InvalidWithdrawTime",
      "msg": "Invalid Withdraw Time"
    },
    {
      "code": 6004,
      "name": "InvalidNFTAddress",
      "msg": "Not Found Staked Mint"
    },
    {
      "code": 6005,
      "name": "InsufficientRewardVault",
      "msg": "Insufficient Reward Token Balance"
    },
    {
      "code": 6006,
      "name": "InsufficientAccountVault",
      "msg": "Insufficient Account Token Balance"
    },
    {
      "code": 6007,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata Address"
    },
    {
      "code": 6008,
      "name": "MetadataCreatorParseError",
      "msg": "Can't Parse The NFT's Creators"
    },
    {
      "code": 6009,
      "name": "UnkownOrNotAllowedNFTCollection",
      "msg": "Unknown Collection Or The Collection Is Not Allowed"
    }
  ]
};

export const IDL: Claiming = {
  "version": "0.1.0",
  "name": "claiming",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "airdrop",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "airdropProof",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "style",
          "type": "u8"
        },
        {
          "name": "mintTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "airdropProof",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "style",
          "type": "u8"
        },
        {
          "name": "receiveTime",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "airdropProof",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "claimedTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidSuperOwner",
      "msg": "Invalid Super Owner"
    },
    {
      "code": 6001,
      "name": "InvalidGlobalPool",
      "msg": "Invalid Global Pool Address"
    },
    {
      "code": 6002,
      "name": "InvalidUserPool",
      "msg": "Invalid User Pool Owner Address"
    },
    {
      "code": 6003,
      "name": "InvalidWithdrawTime",
      "msg": "Invalid Withdraw Time"
    },
    {
      "code": 6004,
      "name": "InvalidNFTAddress",
      "msg": "Not Found Staked Mint"
    },
    {
      "code": 6005,
      "name": "InsufficientRewardVault",
      "msg": "Insufficient Reward Token Balance"
    },
    {
      "code": 6006,
      "name": "InsufficientAccountVault",
      "msg": "Insufficient Account Token Balance"
    },
    {
      "code": 6007,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata Address"
    },
    {
      "code": 6008,
      "name": "MetadataCreatorParseError",
      "msg": "Can't Parse The NFT's Creators"
    },
    {
      "code": 6009,
      "name": "UnkownOrNotAllowedNFTCollection",
      "msg": "Unknown Collection Or The Collection Is Not Allowed"
    }
  ]
};
