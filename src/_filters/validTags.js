const invalidTags = ['2024', '2020', 'euro', 'webcal-game']

module.exports = tags => tags.filter(tag => ! invalidTags.includes(tag))
