import parseRecord from './parseGames/_record.js'
const ordinal = /([0-9])(st|nd|rd|th)$/i

function toCardinal (str = '') {
  str = str.trim()
  if (ordinal.test(str)) {
    str = str.replace(ordinal, '$1')
    return Number(str)
  }
  if (/^[0-9]+$/.test(str)) {
    return Number(str)
  }
  return str
}

//
function parseInfobox (doc) {
  let info = doc.infobox('ice hockey team season') || doc.infobox('NHLTeamSeason')
  if (!info) {
    return {}
  }
  let data = info.keyValue()
  Object.keys(data).forEach((k) => {
    data[k] = toCardinal(data[k])
  })
  if (data.record) {
    data.record = parseRecord(data.record)
  }
  return data
}
export default parseInfobox
