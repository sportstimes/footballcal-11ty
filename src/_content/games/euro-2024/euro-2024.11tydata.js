module.exports = {
  tags: ['euro', 'euro-2024'],
  layout: 'game.njk',
  permalink: ({ path }) => path.replace(/\/$/, '') + '/'
};
