# Smart contracts

## The following prerequisites are required to be installed on your system:
- hardhat: v2.10.2  ※if > 2.11, there is no rpcQuantityToBN function error
- NodeJS
- Yarn (optional)

Then run:

```sh
yarn install
```

Get more ASTAR for testing: [LINK](https://docs.astar.network/docs/quickstart/faucet)

ASTAR Testnet Explorer: [LINK](https://docs.blockscout.com/for-users/verifying-a-smart-contract)

## Deploy contracts
### Localhost
#### Set admin private key in .env.development
- `ADMIN_PRIVATE_KEY`: Private key


#### Start hardhat
```sh
yarn start:dev
```

##### NFT deploy
Deploy and mint 100 token.

Set your NFT info in  .env.development or .env.staging or .env.production
- `NFT_BASE_URI`: BaseURI of NFT  
- `NFT_NAME`: Name of NFT  
- `NFT_SYMBOL`: Symbol of NFT  

Run script:
- local: `yarn migrate:local-nft`
- development: `yarn dev-kms-shibuya-nft`
- staging: `yarn stg-kms-shibuya-nft`
- production: `yarn prod-kms-shibuya-nft`

##### Remint NFT
Set your NFT info in .env.development or .env.staging or .env.production

- `NFT_ADDRESS`: Address of NFT  
- `NFT_MINT_START`: Token id start mint  
- `NFT_MINT_END`: Token Id end mint

Run script:
- local: `yarn migrate:local-re-mint`
- development: `yarn dev-kms-shibuya-remint-nft`
- staging: `yarn stg-kms-shibuya-remint-nft`
- production: `yarn prod-kms-shibuya-remint-nft`

##### SBT deploy

Set your SBT info in  .env.development or .env.staging or .env.production
- `SBT_NAME`: Name of SBT
- `SBT_SYMBOL`: Symbol of SBT

Run script:
- local: `yarn migrate:local-sbt`
- development: `yarn dev-kms-shibuya-sbt`
- staging: `yarn stg-kms-shibuya-sbt`
- production: `yarn prod-kms-shibuya-sbt`
- 

##### SBT upgrade

Set your SBT info in  .env.development or .env.staging or .env.production
- `SBT_NAME`: Name of SBT
- `SBT_SYMBOL`: Symbol of SBT
- `SBT_ADDRESS`: Address of SBT

Run script:
- local: `yarn migrate:local-upgrade-sbt`
- development: `yarn dev-kms-shibuya-upgrade-sbt`
- staging: `yarn stg-kms-shibuya-upgrade-sbt`
- production: `yarn prod-kms-shibuya-upgrade-sbt`

## Test
```sh
yarn run start:dev
```

and

```sh
yarn run test
```
