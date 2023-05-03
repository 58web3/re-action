# API : Create User

# Objective.
Create a user if the following requirements are met

- User must have a VerificationCode (UUID) as proof of donation
- VerificationCode can be used only once until it is received
- NFT/SBT must be assigned to the user
  - If the user has a VerificationCode, it can be determined that an NFT/SBT has been assigned to the user

# API Design

## API Definitions

| Item Name    | Description |
|--------------|-------------|
| API Endpoint | `/v1/user`  |
| Method       | POST        |

## Request parameters

| Type        | Item Name         | Description                |
|-------------|-------------------|----------------------------|
| Header      | jwt               | ID Token get from Web3Auth |
| Header      | public_key        | Public Key of login user   |
| RequestBody | verification_code | Verification code          |
| RequestBody | wallet_address     | User's wallet address      |

# Processing Details
## Router

1. Check IdToken, if there is an error, throw 401 error

## Controller

### Check parameter
1. Get UserWallet record by public key
2. If UserWallet record is found, throw 409 error.

### Call UserService.createUser method
parameters:
- walletAddress : userWallet.wallet_address
- verificationCode : request_body.verification_code

### Create Response
```
{
  "message": "Success",
  "id_info": {
    "key": "user_id",
    "value": user.user_id"
  }
}
   2. Check that `is_used = false` for the retrieved record
```

## Service
### UserService.createUser method

1. Retrieve the record from the Donor table using the verificationCode
   1. If there is no record, return 404  `Verification code is not found` error
   2. If `is_verified = false`, return 403 `Verification code is not verified` error
   3. If `is_used = true`, return 400 `Verification code is already used` error
2. Create a record in the User table
3. Create a record in the UserWallet table
4. Update a record in the Donor table with `is_used = true` and `owner_user_id = user.user_id(user is created user record)`
5. Return `user_id` of created user record

## Model
### UserModel.createUser method

1. Create User record
- user_id: userId,
- wallets:
  - array:
    - wallet_address: requestBody.wallet_address,
    - wallet_public_key: idTokenUser.wallets[0].public_key
- nickname: nickname,
- type_of_login: idTokenUser.type_of_login,
- is_admin: false,
- is_sent_token: false,
- user_role_ids: [],
- created_at: systemDate,
- created_by: userId,
- updated_at: systemDate,
- updated_by: userId,
- delete_flg: false

### UserWalletModel.createUserWallet method

1. Create UserWallet record
- wallet_address: parameter.walletAddress,
- user_id: parameter.userId,
- wallet_public_key: parameter.walletPublicKey,
- created_at: systemDate,
- created_by: userId,
- updated_at: systemDate,
- updated_by: userId,
- delete_flg: false

