const spacetime = require('spacetime')

const parseSentence = function (doc) {
  let s = doc.sentences(0)
  if (!s) {
    return null
  }
  let txt = s.text() || ''
  let paren = txt.match(/\(.*\)/)
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
      death: split[1]
    }
  }
  // try for just birth date in parentheses
  if (split[0]) {
    let str = split[0].replace(/^(born|ne) (c\.)?/, '')
    let d = spacetime(str)
    if (d.isValid()) {
      return {
        birth: str
      }
    }
  }
  return null
}
module.exports = parseSentence
