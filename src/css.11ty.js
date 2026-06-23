const postcss = require('postcss')
const postcssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const fs = require('fs')
const path = require('path')

module.exports = class {
  data () {
    return {
      layout: null,
      eleventyExcludeFromCollections: true,
      permalink: '/css/site.css'
    }
  }

  async render () {
    const from = path.resolve(__dirname, '_assets/css/site.css')
    const css = fs.readFileSync(from, 'utf8')
    const result = await postcss([
      postcssImport(),
      autoprefixer(),
      cssnano()
    ]).process(css, { from })
    return result.css
  }
}
