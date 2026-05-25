module.exports = class {
  data () {
    return {
      layout: null,
      permalink: '/_redirects',
      eleventyExcludeFromCollections: true
    }
  }

  render ({ collections }) {
    return collections.redirects
      .map(item => `${item.data.redirectFrom}  ${item.url}  301`)
      .join('\n')
  }
}
