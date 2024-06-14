module.exports = {
  layout: 'game.njk',
  permalink: ({ path }) => path.replace(/\/$/, '') + '/'
}
