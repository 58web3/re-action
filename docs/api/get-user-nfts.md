# API : Get User NFTs

# Objective

Retrieve all NFTs/SBTs the user has.  
If the user has sent an NFT to another wallet, that NFT cannot be retrieved.

# API Design

## API Definitions

| Item Name    | Description                       |
|--------------|-----------------------------------|
| API Endpoint | `/v1/wallet/{wallet_address}/nft` |
| Method       | GET                               |

## Request parameters

| Type   | Item Name      | Description                |
|--------|----------------|----------------------------|
| Header | jwt            | ID Token get from Web3Auth |
| Header | public_key     | Public Key of login user   |
| Path   | wallet_address | Wallet Address             |

# Processing Details
## Router
1. Check IdToken, if there is an error, throw 401 error

## Controller
### Call WalletController.getAllNFTs method
#### Call WalletService.getAllNFTs method
parameters:
- walletAddress: req.params.wallet_address

1. Get UserWallet record by public key
    1. If UserWallet record is not found, throw 404 error.

#### Call WalletService.getAllNFTs method
parameters:
- walletAddress: req.params.wallet_address
- count: req.query.count
- page: req.query.page

#### Create Response
```
{
  "total": { Number of NFT/SBTs obtained }
  "result": [{list of obtained NFT/SBT}]
}
```

## Service
### WalletService.getAllNFTs method

#### Call UserNFTModel.getUserNFTsByWalletAddress wallet
parameters:
- walletAddress: req.params.wallet_address

#### Create Response
create return list of Obtained NFT/SBTs
- count: count
- page: page

```
{
  total: { NFTs.length },
  list: { NFTs.slice(page * count, page * count + count) }
}
```

