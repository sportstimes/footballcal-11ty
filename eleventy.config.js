require('dotenv').config()

const { EleventyHtmlBasePlugin } = require('@11ty/eleventy')

const date = require('./src/_filters/date')
const absoluteUrl = require('./src/_filters/absoluteUrl')
const validTags = require('./src/_filters/validTags')
const webcal = require('./src/_filters/webcal')
const { upcoming, limit, next } = require('./src/_filters/collections')

const showDate = require('./src/_methods/showDate')
const isPast = require('./src/_methods/isPast')

module.exports = config => {
  config.addPlugin(EleventyHtmlBasePlugin)
  config.addWatchTarget('./src/_assets/css')

  // filters…
  config.addFilter('date', date)
  config.addFilter('absoluteUrl', absoluteUrl)
  config.addFilter('validTags', validTags)
  config.addFilter('webcal', webcal)
  config.addFilter('isPast', isPast)

  // collections…
  config.addFilter('limit', limit)
  config.addFilter('upcoming', upcoming)
  config.addFilter('next', next)
  config.addCollection('redirects', (collectionApi) => {
    return collectionApi.getAll().filter(item => item.data.redirectFrom)
  })

  // methods…
  config.addNunjucksGlobal('showDate', showDate)
  config.addNunjucksGlobal('isPast', isPast)

  // shortcodes…
  config.addShortcode('year', () => new Date().getFullYear())

  config.addFilter('commaNumber', n => Number(n).toLocaleString('en-GB'))

  config.addFilter('daysAgo', (dateStr) => {
    const { DateTime } = require('luxon')
    const past = DateTime.fromISO(dateStr)
    const now = DateTime.now()
    return Math.floor(now.diff(past, 'days').days)
  })

  config.addPassthroughCopy({
    'src/_assets/img': 'img',
    'src/_assets/js': 'js'
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
      data: '_data',
      includes: '_includes',
      layouts: '_layouts'
    }
  }
}
