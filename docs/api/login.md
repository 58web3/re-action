# API :Login

# Objective.
Processing the login to the system

The login process involves the following steps

1. retrieve the User ID from the UserWallet table using the PublicKey
2. check record exists in the User table using the User ID
3. retrieve unsent NFT/SBT records from the donor table
4. from the donor table, retrieve unsent NFT/SBT records
    1. if there is an unsent NFT/SBT, send NFT/SBT
    2. if the NFT/SBT is successfully sent, update the corresponding record in the donor table to `is_sent = true` 

# API Design

## API Definitions

| Item Name    | Description |
|--------------|-------------|
| API Endpoint | `/v1/login` |
| Method       | POST        |

## Request parameters

| Type   | Item Name  | Description                |
|--------|------------|----------------------------|
| Header | jwt        | ID Token get from Web3Auth |
| Header | public_key | Public Key of login user   |

# Processing Details
## Router

1. Check IdToken, if there is an error, throw 401 error

## Controller

### Check parameter
1. Get Public Key from Request User
2. Get UserWallet record by public key
   If UserWallet record is not found, throw 404 error.

### Call LoginService.login method
parameters:
- user_id : userWallet.user_id

### Create Response
```
{
  "message": {result of login}
  "transfer_fails": [
    {
      "message": sendToken.messageError,
      "token_name": token_name,
      "token_id": token_id
    }
  ]
}
```

## Service
### LoginService.login method

The relationship between the state and Record for each NFT/SBT is shown below.

| Mint State | Description                           | Donor.is_sent_token | UserNFT                 |
|------------|---------------------------------------|---------------------|-------------------------|
| Executed   | Mint is succeeded (with Web3Util)     | no update(false)    | Add NFT/SBT information |
| Failed     | Mint is failed (with Web3Util)        | no update(false)    | Do Nothing              |
| Complete   | Sent to Wallet (confirm with Subscan) | update true         | Do Nothing              |


1. Get the user record from the user table using the UserID
    1. If there is no record, return a 404 `No user account` error
2. Get records from the donor table using the `user_id`
   1. If there is no record, return a 400 `Invalid Donor` error
3. Check records one by one, and if there is a record with `is_sent=false`, do the following processes
    1. Get Contract Address from Token table using `token_name`
    2. Check whether the acquired token has been sent, and if so, update the Donor table as sent
    3. If the token has not been sent, checks whether the token type is NFT or SBT
        1. NFT: The token transfer to the user
        2. SBT: Mint the token and give it to the user
    4. Add a record of the sent NFT/SBTs to UserNFT table
    5. If the transfer NFT/SBT failed, it returns that a transmission error has occurred.
        1. Create error message for transmission error
            - message : sendToken.messageError
            - token_name: donor.token_name
            - token_id: donor.token_id
        2. Output log to backend server
            - message : sendToken.messageError
            - contract_address: token.contract_address
            - token_name: donor.token_name
            - token_id: donor.token_id
4. Check NFT/SBT transmission results
    1. If all transmissions fail, return 403 `NFT/SBT possession required`
    2. If one or more transmissions succeed, returns 200 `success`
    3. If there is a transmission error, return the error messages `transfer_fails` (in both 200 and 403)

## Model
### DonorModel.getDonors method
1. Scan donor table by user_id
2. return scanned donor records

### DonorModel.updateDonor method
1. Update donor record
- code: donor.verification_code
- owner_user_id: user_id
- is_sent_token: true
- updated_at: System date
- updated_by: user_id

### TokenModel.getToken method
1. Call TokenModel.getToken method
   parameters:
    - token_name: parameter.tokenName

### UserNFTModel.addUserNft method
1. Get user NFT record from the UserNFT table using `usedId` and `tokenAddress`
2. Get token URI from Web3Util service using `userId` and `tokenId`
3. Get metadata from Web3Util service using `tokenURI`
4. Get imageUrl from Web3Util service using `metadata?.image`
5. Get nftName = parameter.tokenName
6. Declare tokenIdObj object
    - name: nftName (no.5)
    - token_id: parameter.tokenId
    - symbol: parameter.symbol
    - token_uri: tokenURI (no.2)
    - image_url: imageUrl (no.4)
    - metadata: JSON.stringify(metadata) (no.3)
    - owner_of: parameter.walletAddress
7. If UserNFT is not found return UserNFT.create
8. Check tokenId exists in UserNFT.token_ids
    1. If false return UserNFT.update
        - $ADD: 
            - token_ids: [tokenIdObject] (No.6)


### Web3Util.getTokenURI method
parameters:
    - tokenAddress: parameter.tokenAddress
    - tokenId: parameter.tokenId
1. Declare `key` to get cache: "tokenURI" + parameter.tokenAddress
2. Check cached by `key` exists
    1. if true, return cache.get(key) + `tokenId` + ".json"
    2. if false
        1. get tokenURI by web3
        2. set cache by key
        3. return tokenURI
### Web3Util.getMetadata method
parameters: 
    - tokenURI: parameter.tokenURI
1. Check tokenURI starts with `ipfs://` 
    1. if true,  replace `ipfs://` to `https://ipfs.io/ipfs/` to get metadata
2. Call axios.get(tokenURI)
3. return data

### Web3Util.getImageUrl method
parameters: 
    - imageUrl: parameter.imageUrl
1. Check imageUrl starts with `ipfs://` 
    1. if true,  replace `ipfs://` to `https://{IPFS GATEWAY DOMAIN}/ipfs/` 
3. return imageUrl
