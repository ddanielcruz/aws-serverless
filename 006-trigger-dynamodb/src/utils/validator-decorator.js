const validator = (fn, schema, argsType) => {
  return async function (event) {
    const data = JSON.parse(event[argsType])
    const { error, value } = schema.validate(data, { abortEarly: false })

    if (!error) {
      event[argsType] = value
      return fn.apply(this, arguments)
    }

    return {
      statusCode: 422,
      body: JSON.stringify({ message: error.message }, null, 2)
    }
  }
}

module.exports = validator
