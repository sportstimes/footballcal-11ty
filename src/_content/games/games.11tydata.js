module.exports = {
  layout: 'game.njk',
  tags: ['webcal-game'],
  permalink: ({ path }) => path.replace(/\/$/, '') + '/'
}
