// Shift the decimal exponent to avoid rounding errors such as 1.005 * 100.
const shift = (value, places) => {
  const [digits, exponent = '0'] = String(value).split('e')
  return Number(`${digits}e${Number(exponent) + places}`)
}

const roundNumber = (value, decimals, round) => {
  const number = Number(value)
  const places = Number(decimals || 0)
  if (!Number.isFinite(number) || !Number.isInteger(places)) {
    return ''
  }
  const shifted = shift(number, places)
  if (!Number.isFinite(shifted)) {
    return String(number)
  }
  return String(shift(round(shifted), -places))
}

export default roundNumber
