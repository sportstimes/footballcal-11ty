const dateTime = require('moment')

module.exports = (date, index, collection) => {
  const prevIndex = index - 1

  if (! (prevIndex in collection)) {
    return true
  }

  const prevDay = collection[prevIndex].data.date

  return dateTime(prevDay).format('ddd DD MMM') !== dateTime(date).format('ddd DD MMM')
}
