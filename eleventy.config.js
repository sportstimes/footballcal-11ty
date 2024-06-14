require('dotenv').config()

const { EleventyHtmlBasePlugin } = require('@11ty/eleventy')

const moment = require('./src/_filters/moment')
const absoluteUrl = require('./src/_filters/absoluteUrl')
const stringify = require('./src/_filters/stringify')
const { number } = require('./src/_filters/numbers')

module.exports = config => {
  config.addPlugin(EleventyHtmlBasePlugin)

  config.addFilter('moment', moment)
  config.addFilter('absoluteUrl', absoluteUrl)
  config.addFilter('stringify', stringify)
  config.addFilter('formattedNumber', number)

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
