import parseRecord from './record.js'

const ordinal = /^([0-9]+)(?:st|nd|rd|th)$/i

// '3rd' → 3,  '2,006' → 2006,  text stays text
const clean = function (str = '') {
  str = String(str).trim()
  const m = str.match(ordinal)
  if (m) {
    return Number(m[1])
  }
  if (/^[0-9][0-9,]*$/.test(str)) {
    return Number(str.replace(/,/g, ''))
  }
  return str
}

// flatten a team-season infobox into {key: value}, with the record parsed
const parseInfobox = function (doc, names = [], recordOpts = {}) {
  let info = null
  for (const name of names) {
    info = doc.infobox(name)
    if (info) {
      break
    }
  }
  if (!info) {
    return {}
  }
  const data = {}
  Object.entries(info.json().data).forEach(([key, block]) => {
    data[key] = clean(block.text || '')
  })
  // 'record', 'homerecord', 'roadrecord' all parse as win-loss records
  Object.keys(data).forEach((key) => {
    if (/record$/.test(key)) {
      data[key] = parseRecord(String(data[key]), recordOpts) || data[key]
    }
  })
  return data
}
export default parseInfobox
