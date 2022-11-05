const { get } = require('axios').default

module.exports = class Handler {
  constructor({ rekognitionSvc, translatorSvc }) {
    this.rekognitionSvc = rekognitionSvc
    this.translatorSvc = translatorSvc
  }

  async main(event) {
    try {
      const imageUrl = event?.queryStringParameters?.imageUrl
      if (!imageUrl) {
        return {
          statusCode: 400,
          body: 'An image is required!'
        }
      }

      console.log('[main] Downloading image')
      const buffer = await this.#getImageBuffer(imageUrl)

      console.log('[main] Detecting labels')
      const { names, workingItems } = await this.#detectImageLabels(buffer)

      console.log('[main] Translating labels to Portuguese')
      const texts = await this.#translateText(names)
      const finalText = this.#formatTextResults(texts, workingItems)

      return {
        statusCode: 200,
        body: `A imagem tem\n`.concat(finalText)
      }
    } catch (error) {
      console.error('[main]', error.stack)
      return {
        statusCode: 500,
        body: 'Internal server error'
      }
    }
  }

  async #getImageBuffer(imageUrl) {
    const response = await get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'base64')

    return buffer
  }

  async #detectImageLabels(buffer) {
    const result = await this.rekognitionSvc.detectLabels({ Image: { Bytes: buffer } }).promise()
    const workingItems = result.Labels.filter(({ Confidence }) => Confidence > 80)
    const names = workingItems.map(({ Name }) => Name).join(', ')

    return {
      names,
      workingItems
    }
  }

  async #translateText(text) {
    const params = { SourceLanguageCode: 'en', TargetLanguageCode: 'pt', Text: text }
    const { TranslatedText } = await this.translatorSvc.translateText(params).promise()

    return TranslatedText.split(', ')
  }

  #formatTextResults(texts, workingItems) {
    const finalText = []

    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText]
      const confidence = workingItems[indexText].Confidence

      finalText.push(`${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`)
    }

    return finalText.join(`\n`)
  }
}
