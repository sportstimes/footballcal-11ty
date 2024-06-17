const { DateTime } = require('luxon')

module.exports = post => DateTime.fromISO(post.data.endDate || post.data.date) <= DateTime.now()
