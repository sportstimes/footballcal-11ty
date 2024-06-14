module.exports = (date, format = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) => {
  return new Date(date).toLocaleDateString('en-GB', format)
}
