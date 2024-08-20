module.exports = {
  plugins: [
    require('postcss-import')({
      plugins: [
        require('stylelint')({
          quietDeprecationWarnings: true
        })
      ]
    }),
    require('autoprefixer'),
    require('cssnano')
  ]
}
