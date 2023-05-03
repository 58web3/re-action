## API RBAC
### Role
- Admin: Users who mange ReNFT
- Member: Users who have NFT/SBT
- LoginUser: Users logged in
- Guest: Users not logged in
  
### Resource
- User
- Token
- Wallet
- CSRF

### Action
- read:any
- update:any
- create:any
- delete:any
- read:own
- update:own
- create:own
- delete:own

### Permission
- Admin: Can do all actions

- Member
  - User: create:own,read:own
    - Post /v1/user
    - Get /v1/user/{user_id}
  - Wallet: create:own,read:own
    - Get /v1/wallet/{wallet_address}/user_id
    - Get /v1/wallet/{wallet_address}/nft
  
- LoginUser
  - Wallet: read:own
    - Get /v1/wallet/{wallet_address}/nft

- Guest:
  - Put /v1/verification-code/verify
  - Post /v1/login

### Judge user role
Order of determination of roles.
Role identification is checked in following order, then  the appropriate role is returned when it is determined.
 Admin > Member > LoginUser > Guest
 
#### Admin
Judge if Dao.admin_role_id in User.user_role_ids

#### Member
1. Get public key from req.user
2. Get UserWallet by public key
3. If UserWallet is null, throw 403 error

#### LoginUser
Judge if getting wallets by req.user is not null

#### Guest
If all of the above do not match
### Set role to req.user
Set role name req.user.role

### Check permission
#### RBAC module
`accesscontrol`

https://github.com/onury/accesscontrol

#### Check permission
1. Define grants at once
2. Create a AccessControl using grants
3. Call AccessControl.can(req.user.role).{action}
4. If permission.granted is false, throw 403 error
