# RE:NFT API
## Prerequisites
- Git 2.xx.xx
- Node.js (latest LTS version) 18.xx.xx
- Yarn 1.22.xx
- [DynamoDB Local](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/DynamoDBLocal.html) (for localhost develop)

# Setup
## Copy environment variable file

Copy the files that define environment variables for the target environment.

- Development environment : `.env.development`
- Staging environment : `.env.staging`
- Production environment : `.env.production`

```
copy (.env.development|.env.staging|.env.production) .env
```

## Set environment variables

| Key                                        | Description                                      | Setting Example                                                 |
|--------------------------------------------|--------------------------------------------------|-----------------------------------------------------------------|
| FRONTEND_ENDPOINT                          | Frontend URL                                     | http://localhost:8080                                           |
| USE_DYNAMODB_LOCAL                         | Whether DynamoDB Local is used or not            | true                                                            |
| DYNAMODB_LOCAL_URL                         | URL of DynamoDB Local                            | http://localhost:8000                                           |
| DYNAMODB_REGION                            | Region of DynamoDB                               | ap-northeast-1                                                  |
| DYNAMODB_TABLE_PREFIX                      | Prefix assigned to the table created in DYNAMODB | dev_reaction_                                                      |
| SHIBUYA_RPC                                | URL of SHIBUYA_RPC                               | https://shibuya.public.blastapi.io                              |
| SUBSCAN_END_POINT                          | URL of Subscan erc721 collectibles API           | https://shibuya.api.subscan.io/api/scan/evm/erc721/collectibles |
| SUBSCAN_END_POINT_TOKEN_TRANSFER           | URL of Subscan erc721 transfers API              | https://shibuya.api.subscan.io/api/scan/evm/token/transfer      |
| SUBSCAN_API_KEY                            | API KEY of SUBSCAN_API_KEY                       | bb9ca...                                                        |
| USE_SECRET_MANAGER                         | Whether SECRET MANAGER is used or not            | true                                                            |
| SECRET_MANAGER_REGION                      | Region of SECRET MANAGER                         | ap-northeast-1                                                  |
| SECRET_MANAGER_SUBSCAN_API_KEY_SECRET_NAME | SUBSCAN API KEY SECRET NAME of SECRET MANAGER    | dev/subscan/apikey                                              |
| USE_KMS_ACCOUNT                            | Whether KMS ACCOUNT is used or not               | false                                                           |
| AWS_KMS_REGION                             | Region of KMS                                    | ap-northeast-1                                                  |
| KMS_KEY_ID                                 | Key ID of KMS                                    | 5451c...                                                        |
| ADMIN_PRIVATE_KEY                          | Private Key of ADMIN(Localhost only)             | 40678...                                                        |
| GAS_LIMIT                                  | Limit of GAS to set                              | 400000                                                          |
| LOGGER_LEVEL                               | Log Level                                        | error                                                           |                       |




## Install nodemon to automatically restart Node.js applications

```
yarn global add nodemon
```

## Start DynamoDB for localhost
See [../README.md](../README.md)

# Run API server

## Install node_modules files
```
yarn install 
```

## Start API Server
```
yarn start
```

## When specifying environment variable file at server startup (using dotenv-cli)

### Setup

```sh
yarn global add dotenv-cli
```

### Start API Server (When using `.env_sample`)

```sh
dotenv -e .env_sample yarn start
```

### Access
```
http://localhost:8888/
```

### Test
```
yarn test
```
