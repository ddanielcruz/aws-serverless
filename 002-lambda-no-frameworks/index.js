async function handler(event, context) {
  console.log('[context]', context)
  console.log('[event]', JSON.stringify(event, null, 2))

  return {
    statusCode: 200,
    body: JSON.stringify({ timestamp: new Date().toISOString() })
  }
}

module.exports = { handler }
