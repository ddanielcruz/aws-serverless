const { describe, it, expect, beforeAll, afterAll } = require('@jest/globals')

const { S3 } = require('../../src/factory')
const { main } = require('../../src')

describe('Testing AWS services offline with LocalStack', () => {
  const bucketConfig = { Bucket: 'any-bucket' }

  beforeAll(async () => {
    await S3.createBucket(bucketConfig).promise()
  })

  afterAll(async () => {
    await S3.deleteBucket(bucketConfig).promise()
  })

  it('should return an array with a S3 bucket', async () => {
    const response = await main()
    expect(response.statusCode).toEqual(200)
    expect(JSON.parse(response.body)).toMatchObject({ Buckets: [{ Name: bucketConfig.Bucket }] })
  })
})
