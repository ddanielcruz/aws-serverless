const uuid = require('uuid')
const Joi = require('joi')

const { DynamoDB } = require('./factory')
const validator = require('./utils/validator-decorator')
const { argTypes } = require('./utils/enums')

class Handler {
  constructor({ dynamoDbSvc }) {
    this.dynamoDbSvc = dynamoDbSvc
    this.dynamoDbTable = process.env.DYNAMODB_TABLE
  }

  static validator() {
    return Joi.object({
      name: Joi.string().max(100).min(2).required(),
      power: Joi.string().max(20).required()
    })
  }

  #prepareData(data) {
    return {
      TableName: this.dynamoDbTable,
      Item: {
        ...data,
        id: uuid.v4(),
        createdAt: new Date().toISOString()
      }
    }
  }

  async #insertItem(params) {
    return this.dynamoDbSvc.put(params).promise()
  }

  #handleSuccess(data) {
    return {
      statusCode: 201,
      body: JSON.stringify(data, null, 2)
    }
  }

  #handleError(data) {
    return {
      statusCode: data.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: "Couldn't create item!"
    }
  }

  async main(event) {
    try {
      const dbParams = this.#prepareData(event.body)
      await this.#insertItem(dbParams)

      return this.#handleSuccess(dbParams.Item)
    } catch (error) {
      console.error(error)
      return this.#handleError({ statusCode: 500 })
    }
  }
}

const handler = new Handler({ dynamoDbSvc: DynamoDB })

module.exports = validator(handler.main.bind(handler), Handler.validator(), argTypes.BODY)
