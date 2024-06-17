const { DateTime } = require('luxon')

module.exports = (date, format) => {
  return DateTime.fromISO(date).toFormat(format)
}
