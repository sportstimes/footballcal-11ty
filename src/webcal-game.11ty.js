const ics = require('ics')
const IcalTemplate = require('./_methods/IcalTemplate')

module.exports = class {
  data() {
    return {
      layout: null,
      pagination: {
        data: 'collections.webcal-game',
        size: 1,
        alias: 'game',
      },
      permalink: function (data) {
        return data.game.data.path.replace(/\/$/, '.ics')
      },
    }
  }

  render({ config, game }) {
    return ics.createEvent(new IcalTemplate(game, config)).value
  }
}
