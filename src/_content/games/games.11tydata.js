module.exports = {
  tags: ['game'],
  layout: 'game.njk',
  permalink: ({ path }) => path.replace(/\/$/, '') + '/'
};
