require('dotenv').config()

const { EleventyHtmlBasePlugin } = require('@11ty/eleventy')

const postcss = require('postcss')
const postcssImport = require('postcss-import')

const dateFormat = require('./src/_filters/date')
const timeFormat = require('./src/_filters/time')
const absoluteUrl = require('./src/_filters/absoluteUrl')
const stringify = require('./src/_filters/stringify')
const { number } = require('./src/_filters/numbers')

module.exports = config => {
  config.addPlugin(EleventyHtmlBasePlugin)

  config.addFilter('dateFormat', dateFormat)
  config.addFilter('timeFormat', timeFormat)
  config.addFilter('absoluteUrl', absoluteUrl)
  config.addFilter('stringify', stringify)
  config.addFilter('formattedNumber', number)

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
