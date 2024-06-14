const moment = require('moment')

module.exports = (date, index, collection) => {
  const prevIndex = index - 1

  if (! (prevIndex in collection)) {
    return true
  }

  const prevDay = collection[prevIndex].data.date

  return moment(prevDay).format('ddd DD MMM') !== moment(date).format('ddd DD MMM')
}
