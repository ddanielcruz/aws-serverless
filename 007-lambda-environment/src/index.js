const AWS = require('aws-sdk')
const axios = require('axios')
const cheerio = require('cheerio')
const uuid = require('uuid')

const settings = require('./settings')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

class Handler {
  static async main() {
    const { data } = await axios.get(settings.commitMessagesUrl)
    const $ = cheerio.load(data)
    const [commitMessage] = $('#content').text().trim().split('\n')
    const params = {
      TableName: settings.dbTableName,
      Item: { commitMessage, id: uuid.v4(), createdAt: new Date().toISOString() }
    }
    await dynamoDb.put(params).promise()

    return { statusCode: 204, body: null }
  }
}

module.exports = {
  scheduler: Handler.main
}
