const ics = require('ics')
const IcalTemplate = require('./_methods/IcalTemplate')

module.exports = class FeedTemplate {
  data () {
    return {
      layout: null,
      permalink: '/events.ics'
    }
  }

  render ({ config, collections }) {
    const events = collections['webcal-game'].map(game => new IcalTemplate(game, config))

    return ics.createEvents(events).value
  }
}
