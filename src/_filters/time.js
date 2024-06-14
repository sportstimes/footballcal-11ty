module.exports = (date, format = { hour: '2-digit', minute: '2-digit' }) => {
  return new Date(date).toLocaleTimeString('en-GB', format)
}
