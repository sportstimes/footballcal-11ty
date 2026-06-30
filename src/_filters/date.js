const { DateTime } = require('luxon')

function ordinal (n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return "'" + n + (s[(v - 20) % 10] || s[v] || s[0]) + "' "
}

module.exports = (dateVal, format, locale = 'en') => {
  const dt = (dateVal instanceof Date
    ? DateTime.fromJSDate(dateVal, { zone: 'utc' })
    : DateTime.fromISO(dateVal)
  ).setLocale(locale)
  return dt.toFormat(format.replace('dS ', ordinal(dt.day)))
}
