require('dotenv').config()

const { EleventyHtmlBasePlugin } = require('@11ty/eleventy')

const date = require('./src/_filters/date')
const absoluteUrl = require('./src/_filters/absoluteUrl')
const validTags = require('./src/_filters/validTags')
const webcal = require('./src/_filters/webcal')

const showDate = require('./src/_methods/showDate')

module.exports = config => {
  config.addPlugin(EleventyHtmlBasePlugin)

  config.addFilter('date', date)
  config.addFilter('absoluteUrl', absoluteUrl)
  config.addFilter('validTags', validTags)
  config.addFilter('webcal', webcal)

  config.addNunjucksGlobal('showDate', showDate)

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
