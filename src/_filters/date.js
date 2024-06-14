const dateTime = require('moment')

module.exports = (date, format) => {
  return dateTime(date).format(format)
}
