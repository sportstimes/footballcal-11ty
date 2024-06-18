const { DateTime } = require('luxon')
const absoluteUrl = require('../_filters/absoluteUrl')

module.exports = class {
  constructor (game, config = {}) {
    const event = {
      start: this.date(game.data.date),
      title: game.data.title,
      description: this.description(game),
      location: game.data.locationName,
      url: absoluteUrl(game.page.url, config.baseUrl),
      status: 'CONFIRMED',
      categories: game.data.tags
    }

    if (game.data.endDate) {
      event.end = this.date(game.data.endDate)
    } else {
      event.duration = { hours: 1, minutes: 45 }
    }

    return event
  }

  date (date) {
    return DateTime.fromISO(date).toFormat('y-LL-d-H-mm').split('-').map(a => parseInt(a, 10))
  }

  description (game) {
    let description = game.content.replace(/(<([^>]+)>)/gi, '').replace(/\n$/, '')

    if (game.data.tv !== undefined) {
      description = `TV Channels: ${game.data.tv.join(', ')}\r\n\r\n${description}`
    }

    return description
  }
}
