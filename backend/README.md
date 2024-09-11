# Claiming-Program

This project is the claiming program with mint date and receive NFT date. And the rewards can be changed according to the tier of the NFT.

Instead of regular staking systems, this is the claiming system, where NFT holders can claim their rewards every 2 weeks if they hold NFT in their wallet for 2 weeks.

## Install Dependencies
- Install `node` and `yarn`
- Install `ts-node` as global command
- Confirm the solana wallet preparation: `/home/ubuntu/fury/deploy-keypair.json` in test case

### Before that in your PC solana programs have to be installed with this version
- $ solana --version
// solana-cli 1.8.16 (src:23af37fe; feat:1886190546)
- $ anchor --version
// anchor-cli 0.24.2
- $ node --version
// v16.14.0
- $ yarn --version
// 1.22.17
- $ cargo --version
// cargo 1.59.0 (49d8809dc 2022-02-10)

### Usage
- Main script source for all functionality is here: `/cli/script.ts`
- Program account types are declared here: `/cli/types.ts`
- Idl to make the JS binding easy is here: `/cli/claiming.ts`


## How to deploy this program and add NFT to this pool?
First of all, you have to git clone in your PC.
In the folder `Claiming-Program/claiming`, in the terminal 
1. `yarn`
2. `anchor build`
   In the last sentence you can see:  
```
To deploy this program:
  $ solana program deploy /home/ubuntu/apollo/Claiming-Program/claiming/target/deploy/claiming.so
The program address will default to this keypair (override with --program-id):
  /home/ubuntu/apollo/Claiming-Program/claiming/target/deploy/claiming-keypair.json
```  
3. `solana-keygen pubkey /home/ubuntu/apollo/Claiming-Program/claiming/target/deploy/claiming-keypair.json`
4. You can get the pubkey of the program ID : ex."3u...QXF"
5. Please add this pubkey to the lib.rs
  `line 18: declare_id!("3u...QXF");`
6. Please add this pubkey to the Anchor.toml
  `line 5: claiming = "3u...QXF"`
7. Please add this pubkey to the types.ts
  `line 6: export const CLAIMING_PROGRAM_ID = new PublicKey("3u...QXF");`
8. `anchor build` again
9. `solana program deploy /home/ubuntu/apollo/Claiming-Program/claiming/target/deploy/claiming.so`
10. In backend/ directory in terminal `yarn ts-node`
11. If this error comes - `Error: Provider local is not available on browser.`, 
please run  `export BRWOSER=`
12. In backend/ directory in terminal `yarn ts-node`again.

Then you can enjoy this program.

## Usage

### As a Smart Contract Owner
For the first time use, the Smart Contract Owner should `initialize` the Smart Contract for global account allocation.
```js
/**
 * Initialize the project
 */
export const initProject = async ()
```

### As the User
The users can airdrop the $POX token if it is not ever claimed. the function `airdrop`
```js
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
)
```

The users can claim the $POX token if it is already claimed. the fucntion `claim`
```js
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
)
```
