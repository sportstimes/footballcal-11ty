require('dotenv').config()

const { EleventyHtmlBasePlugin } = require('@11ty/eleventy')

const date = require('./src/_filters/date')
const absoluteUrl = require('./src/_filters/absoluteUrl')
const validTags = require('./src/_filters/validTags')

const showDate = require('./src/_methods/showDate')

module.exports = config => {
  config.addPlugin(EleventyHtmlBasePlugin)

  config.addFilter('date', date)
  config.addFilter('absoluteUrl', absoluteUrl)
  config.addFilter('validTags', validTags)

  config.addNunjucksGlobal('showDate', showDate)

  config.addCollection('euro2024', function (collectionApi) {
    return collectionApi.getFilteredByTags('euro', '2024')
  })

  config.addCollection('euro2020', function (collectionApi) {
    return collectionApi.getFilteredByTags('euro', '2020')
  })

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
