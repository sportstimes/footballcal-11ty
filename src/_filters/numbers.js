module.exports = {
  number: (number, maximumFractionDigits = 0) => {
    return number ? number.toLocaleString('en-GB', {
      maximumFractionDigits
    }) : 0
  }
}
