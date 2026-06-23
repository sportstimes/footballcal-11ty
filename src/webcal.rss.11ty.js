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
        return `/${data.comp.theme}.rss`
      }
    }
  }

  render ({ config, collections, site, comp }) {
    const tag = comp.shortTitle || comp.title
    const games = (collections[tag] || []).slice().sort((a, b) => a.data.date - b.data.date)
    const baseUrl = config.baseUrl || site.url

    const escape = str => String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    const parseDate = d => d ? DateTime.fromISO(d.toISOString ? d.toISOString() : d) : null

    const items = games.map(game => {
      const start = parseDate(game.data.date)
      const end = parseDate(game.data.endDate)
      const url = `${baseUrl}${game.page.url}`
      const tv = (game.data.tv || []).join(', ')
      const body = (game.templateContent || '').replace(/<[^>]+>/g, '').trim()

      const descParts = [
        body,
        `Venue: ${game.data.locationName}`,
        start ? `Kick-off: ${start.toFormat("cccc d LLLL yyyy, HH:mm 'UTC'")}` : '',
        end ? `End: ${end.toFormat("cccc d LLLL yyyy, HH:mm 'UTC'")}` : '',
        tv ? `TV: ${tv}` : ''
      ].filter(Boolean)

      return `    <item>
      <title><![CDATA[${game.data.title}]]></title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <pubDate>${start ? start.toRFC2822() : ''}</pubDate>
      <description><![CDATA[${descParts.join('\n')}]]></description>
    </item>`
    }).join('\n')

    const feedUrl = `${baseUrl}/${comp.theme}.rss`
    const buildDate = DateTime.utc().toRFC2822()

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(comp.title)} — Football Cal</title>
    <link>${escape(baseUrl)}${escape(comp.path)}</link>
    <description>All ${escape(comp.title)} match fixtures — dates, kick-off times, venues and TV channels.</description>
    <language>en-gb</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escape(feedUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
  }
}
