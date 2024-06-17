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

  // methods…
  config.addNunjucksGlobal('showDate', showDate)
  config.addNunjucksGlobal('isPast', isPast)

  // shortcodes…
  config.addShortcode('year', () => new Date().getFullYear())

  config.addPassthroughCopy({
    'src/_assets/img': 'img'
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
