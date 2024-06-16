const ics = require('ics')
const IcalTemplate = require('./_methods/IcalTemplate')

module.exports = class {
  data() {
    return {
      layout: null,
      pagination: {
        data: 'collections',
        size: 1,
        alias: 'games',
        filter: ['all', 'webcal-game'],
      },
      permalink: function (data) {
        return `/${this.slugify(data.games)}.ics`
      },
    }
  }

  render({ config, collections, games }) {
    const events = collections[games].map(game => new IcalTemplate(game, config))

    return ics.createEvents(events).value
  }
}
