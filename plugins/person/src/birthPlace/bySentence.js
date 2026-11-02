// 'was born in Tupelo, Mississippi.' → 'Tupelo, Mississippi'
const bySentence = function (doc) {
  const s = doc.sentences()[0]
  if (!s) {
    return null
  }
  const txt = s.text()
  const idx = txt.search(/\bborn\b/)
  if (idx === -1) {
    return null
  }
  // the first 'in Place' after 'born'
  const m = txt.slice(idx).match(/ in ([A-Z][^.;()]*)/)
  if (!m) {
    return null
  }
  // cut trailing clauses
  let place = m[1].split(/,? (?:and|where|to|on) /)[0]
  place = place.replace(/[,\s]+$/, '').trim()
  if (!place) {
    return null
  }
  return place
}
export default bySentence
