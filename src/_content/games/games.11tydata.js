const { DateTime } = require('luxon')

module.exports = {
  layout: 'game.njk',
  tags: ['webcal-game'],
  permalink: ({ path }) => path.replace(/\/$/, '') + '/',
  eleventyComputed: {
    pageDescription: (data) => {
      if (!data.title || !data.date) return null
      const dt = DateTime.fromISO(data.date).setLocale('en')
      const dateStr = dt.toFormat('cccc, MMMM d yyyy')
      const timeStr = dt.toFormat('h:mma')
      const venue = data.locationName || 'TBC'
      return `Watch ${data.title} at ${venue} on ${dateStr}. Kick-off at ${timeStr}. Add the fixture to your calendar with one click.`
    },
    competitors: (data) => {
      if (!data.title) return []
      const parts = data.title.split(' v ')
      return parts.length === 2 ? parts.map(p => p.trim()) : []
    }
  }
}
