# Define function variables
ROLE_NAME=lambda-example
NODEJS_VERSION=nodejs16.x
FUNCTION_NAME=hello-cli

# Create folder for logs
mkdir -p logs

# Create role for function with access only to AWS Lambda
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://policies.json \
  | tee logs/001.role.log

# Read policy ARN from logged output
POLICY_ARN=$(cat logs/001.role.log | jq -r .Role.Arn)

# Zip project and publish to AWS
zip function.zip index.js
aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime $NODEJS_VERSION \
  --role $POLICY_ARN \
  | tee logs/002.lambda-create.log

# Update function if needed
aws lambda update-function-code \
  --zip-file fileb://function.zip \
  --function-name $FUNCTION_NAME \
  --publish \
  | tee logs/003.lambda-update.log

# Invoke created function
aws lambda invoke \
  --function-name $FUNCTION_NAME logs/004.lambda-exec.log \
  --log-type Tail \
  --query 'LogResult' \
  --output text | base64 -d

# Invoking function with a payload
aws lambda invoke \
  --function-name $FUNCTION_NAME logs/005.lambda-exec.log \
  --log-type Tail \
  --query 'LogResult' \
  --cli-binary-format raw-in-base64-out \
  --payload '{"name":"danielcruz"}' \
  --output text | base64 -d

# Remove created function and role
aws lambda delete-function --function-name $FUNCTION_NAME
aws iam delete-role --role-name $ROLE_NAME
