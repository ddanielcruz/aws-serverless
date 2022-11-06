const handler = {
  async main(event) {
    console.log('[event]', JSON.stringify(event, null, 2))
    return { statusCode: 204, body: null }
  }
}

module.exports = handler.main.bind(handler)
