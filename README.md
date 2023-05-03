# Re:NFT

## Config frontend .env
- cd frontend
- Copy .env_sample to .env file
- Change .env setting

## Config api .env
- cd api
- Copy .env_sample to .env file
- Change .env setting
    - `DYNAMODB_LOCAL_URL=http://localhost:8000`

## Start dynamodbLocal for API development
### Start dynamodb-local and dynamodb-admin
- start
```
docker-compose -f .\docker-compose-dynamolocal.yml up -d
```
- stop
```
docker-compose down
```

## Deploy localhost API for frontend development
### Build docker image for localhost API
- back to `re_nft` directory
- build docker image
```
docker-compose build
```

### Start Docker for localhost API
- start
```
docker-compose up -d
```
- stop
```
docker-compose down
```

### View dynamodb data
```
http://localhost:8001/
```

### Access frontend
```
http://localhost:8080/
```

## Deploy development
## Build for development
- back to `re_nft` directory
- build docker image
```
docker-compose -f ./docker-compose-prod.yml build
```


## Build staging
## Build for staging
- back to `re_nft` directory
- build docker image
```
docker-compose -f ./docker-compose-prod.yml build
```

## Build production
### Config
- API: api/.env
- Frontend: frontend/.env.production
- Batch: batch/.env
### Build for production
- back to `re_nft` directory
- build docker image
```
docker-compose -f ./docker-compose-prod.yml build
```

# Frontend / Backend Update Procedure
## For development environment

The update process is performed after login to `Bastion server`.

```
ssh -i ~/.ssh/renft-development.pem ec2-user@{Bastion IP}
```

## Update Frontend and backend code and deploy
```
# Move to the git repository directory
[ec2-user@bastion ~]$ cd re_nft/

# Pull the latest code in the develop branch
[ec2-user@bastion re_nft]$ git checkout develop
[ec2-user@bastion re_nft]$ git pull

# Copy the configuration file
[ec2-user@bastion re_nft]$ cp ~/bak/api/.env.development ~/re_nft/api/
[ec2-user@bastion re_nft]$ cp ~/bak/frontend/.env.development ~/re_nft/frontend/

# Run deployment
[ec2-user@bastion re_nft]$ cd ~/re_nft/aws_infra/
[ec2-user@bastion aws_infra]$ ./dev-deploy.sh
```

