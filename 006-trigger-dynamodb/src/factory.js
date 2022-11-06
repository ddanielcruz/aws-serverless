const AWS = require('aws-sdk')

const dynamoConfig = {}

if (process.env.IS_OFFLINE) {
  AWS.config.update({
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test'
    }
  })

  const host = process.env.LOCALSTACK_HOST || 'localhost'
  dynamoConfig.endpoint = new AWS.Endpoint(`http://${host}:4566`)
}

const DynamoDB = new AWS.DynamoDB.DocumentClient(dynamoConfig)

module.exports = {
  DynamoDB
}
