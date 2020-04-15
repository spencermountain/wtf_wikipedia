// const spacetime = require('spacetime')

const parseSentence = function (doc) {
  let txt = doc.sentences(0).text() || ''
  let paren = txt.match(/\(.*\)/)
  if (paren) {
    txt = paren[0] || ''
    txt = txt.trim()
    txt = txt.replace(/^\(/, '')
    txt = txt.replace(/\)$/, '')
    let split = txt.split(/ – /)
    split = split.filter((s) => s)
    // got birth/death info
    if (split[0] && split[1] && split.length === 2) {
      return {
        birth: split[0],
        death: split[1]
      }
    }
  }
  // console.log(paren)
  // console.log(sentence)
  return null
}
module.exports = parseSentence
