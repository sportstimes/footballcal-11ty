module.exports = {
  plugins: [
    require('postcss-import')({
      plugins: [
        require('stylelint')
      ]
    }),
    require('autoprefixer')
  ]
}
