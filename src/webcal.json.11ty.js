const { DateTime } = require('luxon')

module.exports = class {
  data () {
    return {
      layout: null,
      eleventyExcludeFromCollections: true,
      pagination: {
        data: 'competitions',
        size: 1,
        alias: 'comp'
      },
      permalink: function (data) {
        return `/${data.comp.theme}.json`
      }
    }
  }

  render ({ config, collections, site, comp }) {
    const tag = comp.shortTitle || comp.title
    const games = (collections[tag] || []).slice().sort((a, b) => a.data.date - b.data.date)
    const baseUrl = config.baseUrl || site.url

    const parseDate = d => d ? DateTime.fromISO(d.toISOString ? d.toISOString() : d) : null

    const items = games.map(game => {
      const start = parseDate(game.data.date)
      const end = parseDate(game.data.endDate)
      const url = `${baseUrl}${game.page.url}`
      const summary = (game.templateContent || '').replace(/<[^>]+>/g, '').trim()

      return {
        id: url,
        url,
        title: game.data.title,
        summary,
        date_published: start ? start.toISO() : null,
        _footballcal: {
          startDate: start ? start.toISO() : null,
          endDate: end ? end.toISO() : null,
          location: game.data.locationName || null,
          tv: game.data.tv || [],
          tags: (game.data.tags || []).filter(t => t !== tag && t !== 'webcal-game'),
          lastMeeting: game.data.lastMeeting || null
        }
      }
    })

    const feed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: `${comp.title} — Football Cal`,
      home_page_url: `${baseUrl}${comp.path}`,
      feed_url: `${baseUrl}/${comp.theme}.json`,
      description: `All ${comp.title} match fixtures — dates, kick-off times, venues and TV channels.`,
      language: 'en-GB',
      items
    }

    return JSON.stringify(feed, null, 2)
  }
}
