const aws = require('aws-sdk')

const Handler = require('./handler')

const rekognitionSvc = new aws.Rekognition()
const translatorSvc = new aws.Translate()
const handler = new Handler({ rekognitionSvc, translatorSvc })

// Bind is used to ensure "this" context is the Handler instance
module.exports = handler.main.bind(handler)
