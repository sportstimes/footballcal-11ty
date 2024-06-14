const ics = require('ics')
const absoluteUrl = require('./_filters/absoluteUrl')

module.exports = class FeedTemplate {
  data() {
    return {
      permalink: 'events.ics',
      layout: null,
    }
  }

  render({ config, collections }) {
    collections.euro2024.forEach(function (game) {
      const event = {
        start: game.data.date,
        title: game.data.title,
        description: game.content,
        location: game.data.locationName,
        url: absoluteUrl(game.url, config.baseUrl),
        status: 'CONFIRMED',
        categories: game.data.tags
      }

      if (game.data.endDate) {
        event.end = game.data.endDate
      } else {
        event.duration = { hours: 1, minutes: 45 }
      }

      ics.createEvent(event, (error, value) => {
        if (error) {
          return
        }

        return value
      })
    })

    return 'events.ics'
  }
}
