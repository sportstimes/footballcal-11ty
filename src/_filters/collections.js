const { DateTime } = require('luxon')

const limit = (arr, limit = 1) => arr.slice(0, limit)

const upcoming = arr => {
  return arr.filter(post => DateTime.fromISO(post.data.date) >= DateTime.now())
}

module.exports = {
  limit,
  upcoming,
  next: arr => limit(upcoming(arr), 1).pop()
}
