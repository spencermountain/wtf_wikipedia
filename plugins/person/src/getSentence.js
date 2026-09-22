import spacetime from 'spacetime'

const parseSentence = function (doc) {
  const s = doc.sentence()
  if (!s) {
    return null
  }
  let txt = s.text() || ''
  const paren = txt.match(/\(.*\)/)
  if (!paren || !paren[0]) {
    return null
  }
  txt = paren[0] || ''
  txt = txt.trim()
  txt = txt.replace(/^\(/, '')
  txt = txt.replace(/\)$/, '')
  let split = txt.split(/ – /)
  split = split.filter((str) => str)
  // got birth/death info
  if (split[0] && split[1] && split.length === 2) {
    return {
      birth: split[0],
      death: split[1],
    }
  }
  // try for just birth date in parentheses
  if (split[0]) {
    const str = split[0].replace(/^(born|ne) (c\.)?/, '')
    const d = spacetime(str)
    if (d.isValid()) {
      return {
        birth: str,
      }
    }
  }
  return null
}
export default parseSentence
