const nlp = require('compromise')
const preProcess = require('./00-preProcess')
const findPivot = require('./01-Pivot')

const defaults = {
  max: 60,
  min: 8
}

//check text is appropriate length
const isGood = function (text, options) {
  if (text && text.length > options.min && text.length < options.max) {
    return true
  }
  return false
}

let count = 0
const doSentence = function (doc, options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let sentence = doc.sentences(0)
  if (!sentence) {
    return ''
  }
  let txt = sentence.text()
  let s = nlp(txt)
  preProcess(s)

  let pivot = findPivot(s)
  // if we can't pivot it properly, don't bother
  if (!pivot || !pivot.verb || !pivot.verb.found) {
    return ''
  }
  // maybe it's good already
  let after = pivot.after.text() || ''
  if (isGood(after, options)) {
    count += 1
    console.log(count)
    return after
  }
  // console.log(after.length)
  return '' //sentence
}
module.exports = doSentence
