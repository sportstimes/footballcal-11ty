module.exports = url => `webcal://${url.replace(/^https?:\/\//, '').replace(/\/$/, '')}.ics`
