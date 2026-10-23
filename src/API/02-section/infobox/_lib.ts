const readCoordinate = (box, prefix, directions, limit, separator) => {
  const field = (suffix) => box.getAll([prefix + separator + suffix])[0]?.text().trim() || ''
  const degrees = field('d')
  if (!degrees) {
    return null
  }
  const d = Number(degrees)
  const m = Number(field('m'))
  const s = Number(field('s'))
  const hemisphere = field(directions).toLowerCase()
  if (![d, m, s].every(Number.isFinite) || m < 0 || m >= 60 || s < 0 || s >= 60) {
    return null
  }
  if (hemisphere && (hemisphere.length !== 1 || !directions.includes(hemisphere))) {
    return null
  }
  const value = Math.abs(d) + m / 60 + s / 3600
  if (value > limit) {
    return null
  }
  // A supplied hemisphere determines the sign; otherwise keep signed degrees.
  const negative = hemisphere ? hemisphere === 's' || hemisphere === 'w' : d < 0
  return negative ? -value : value
}

const dmsCoordinates = (box) => {
  const separators = ['', '_']
  for (let i = 0; i < separators.length; i += 1) {
    const separator = separators[i]
    const lat = readCoordinate(box, 'lat', 'ns', 90, separator)
    const lon = readCoordinate(box, 'long', 'ew', 180, separator)
    if (lat !== null && lon !== null) {
      return { template: 'infobox/lat-long', lat, lon }
    }
  }
  return null
}

export default dmsCoordinates
