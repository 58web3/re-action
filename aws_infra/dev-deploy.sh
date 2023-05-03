#!/bin/sh

echo "Dev deploy start ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step1 switch eks ` date "+%Y/%m/%d %H:%M:%S"`"
aws eks update-kubeconfig --name dev-renft-eks --region ap-northeast-1 --role-arn arn:aws:iam::955409730607:role/dev-renft-eks-bastion

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  exit $cmdstatus
fi
echo "Step1 switch eks ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step2 docker-compose build start ` date "+%Y/%m/%d %H:%M:%S"`"
docker-compose -f ../dev-docker-compose.yml build

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  exit $cmdstatus
fi
echo "Step2 docker-compose build end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step3 tag api start ` date "+%Y/%m/%d %H:%M:%S"`"
docker tag renft/dev-api:latest 955409730607.dkr.ecr.ap-northeast-1.amazonaws.com/dev-renft-api:latest

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  exit $cmdstatus
fi
echo "Step3 tag api end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step4 tag frontend start ` date "+%Y/%m/%d %H:%M:%S"`"
docker tag renft/dev-frontend:latest 955409730607.dkr.ecr.ap-northeast-1.amazonaws.com/dev-renft-frontend:latest

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  exit $cmdstatus
fi
echo "Step4 tag frontend end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step5 login to ECR start ` date "+%Y/%m/%d %H:%M:%S"`"
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 955409730607.dkr.ecr.ap-northeast-1.amazonaws.com

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  exit $cmdstatus
fi
echo "Step5 login to ECR end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step6 push api to ECR start ` date "+%Y/%m/%d %H:%M:%S"`"
docker push 955409730607.dkr.ecr.ap-northeast-1.amazonaws.com/dev-renft-api:latest

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  exit $cmdstatus
fi
echo "Step6 push api to ECR end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step7 push frontend to ECR start ` date "+%Y/%m/%d %H:%M:%S"`"
docker push 955409730607.dkr.ecr.ap-northeast-1.amazonaws.com/dev-renft-frontend:latest

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  exit $cmdstatus
fi
echo "Step7 push frontend to ECR end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step8 rollout api start ` date "+%Y/%m/%d %H:%M:%S"`"
kubectl rollout restart deployments/api-deployment -n renft-app

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  echo "try to apply start"
  kubectl apply -f ./yaml/dev/api.yaml
  echo "try to apply end"
fi
echo "Step8 rollout api end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Step9 rollout frontend start ` date "+%Y/%m/%d %H:%M:%S"`"
kubectl rollout restart deployments/frontend-deployment -n renft-app

cmdstatus=$?
if [ $cmdstatus -ne 0 ]; then
  echo "try to apply start"
  kubectl apply -f ./yaml/dev/frontend.yaml
  echo "try to apply end"
fi
echo "Step9 rollout frontend end ` date "+%Y/%m/%d %H:%M:%S"`"

echo "Dev deploy end ` date "+%Y/%m/%d %H:%M:%S"`"