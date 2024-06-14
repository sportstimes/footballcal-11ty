module.exports = url => `webcal://${url.replace(/https?:\/\//, '')}.ics`
