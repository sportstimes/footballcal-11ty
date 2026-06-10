const { DateTime } = require('luxon')

module.exports = {
  layout: 'game.njk',
  tags: ['webcal-game'],
  permalink: ({ path }) => path.replace(/\/$/, '') + '/',
  eleventyComputed: {
    pageDescription: (data) => {
      if (!data.title || !data.date) return null
      const dt = DateTime.fromISO(data.date).toUTC().setLocale('en')
      const dateStr = dt.toFormat('cccc d MMMM yyyy')
      const timeStr = dt.toFormat('HH:mm') + ' UTC'
      const venue = data.locationName || 'TBC'
      return `Add ${data.title} on ${dateStr} at ${timeStr} in ${venue} to your calendar.`
    },
    competitors: (data) => {
      if (!data.title) return []
      const parts = data.title.split(' v ')
      return parts.length === 2 ? parts.map(p => p.trim()) : []
    }
  }
}
