//simply num/denom * 100
const percentage = function (obj) {
  if (!obj.numerator && !obj.denominator) {
    return null
  }
  let perc = Number(obj.numerator) / Number(obj.denominator)
  perc *= 100
  let dec = Number(obj.decimals)
  if (isNaN(dec)) {
    dec = 1
  }
  perc = perc.toFixed(dec)
  return Number(perc)
}

const toNumber = function (str) {
  str = str.replace(/,/g, '')
  str = str.replace(/−/g, '-')
  let num = Number(str)
  if (isNaN(num)) {
    return str
  }
  return num
}

module.exports = {
  percentage: percentage,
  toNumber: toNumber,
}
