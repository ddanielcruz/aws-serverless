const { S3 } = require('./factory')

module.exports.hello = async () => {
  const allBuckets = await S3.listBuckets().promise()
  console.log('[hello] Found buckets:', allBuckets)

  return {
    statusCode: 200,
    body: JSON.stringify(allBuckets, null, 2)
  }
}
