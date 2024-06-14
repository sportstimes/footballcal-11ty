const invalidTags = ['2024', '2020', 'euro']

module.exports = tags => tags.filter(tag => ! invalidTags.includes(tag))
