const { describe, it, expect } = require('@jest/globals')
const aws = require('aws-sdk')

aws.config.update({ region: 'us-east-1' })
jest.setTimeout(30000)

const { main } = require('../../src')
const requestMock = require('../mocks/request.json')

describe('Image Analysis', () => {
  it('should successfully analyze the image returning the results', async () => {
    const result = await main(requestMock)
    expect(result).toEqual({
      statusCode: 200,
      body: 'A imagem tem\n100.00% de ser do tipo Golden Retriever\n100.00% de ser do tipo cão\n100.00% de ser do tipo canino\n100.00% de ser do tipo animal de estimação\n100.00% de ser do tipo animal\n100.00% de ser do tipo mamífero'
    })
  })

  it('given an empty query string it should return status code 400', async () => {
    const result = await main({ queryStringParameters: {} })
    expect(result).toEqual({ statusCode: 400, body: 'An image is required!' })
  })

  it('given an invalid image URL it should return status code 500', async () => {
    const result = await main({ queryStringParameters: { imageUrl: 'invalid-url' } })
    expect(result).toEqual({ statusCode: 500, body: 'Internal server error' })
  })
})
