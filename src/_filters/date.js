const { DateTime } = require('luxon')

function ordinal (n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return "'" + n + (s[(v - 20) % 10] || s[v] || s[0]) + "' "
}

module.exports = (date, format, locale = 'en') => {
  date = DateTime.fromISO(date).setLocale(locale)
  return date.toFormat(format.replace('dS ', ordinal(date.day)))
}
