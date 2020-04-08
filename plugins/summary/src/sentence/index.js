const nlp = require('compromise')
const preProcess = require('./00-preProcess')
const findPivot = require('./01-Pivot')
const byClause = require('./02-byClause')
const safeCut = require('./03-safeCuts')
const hardCut = require('./04-hardCuts')
const isGood = require('./_isGood')

const defaults = {
  max: 60,
  min: 3
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
  let after = pivot.after
  if (isGood(after, options)) {
    return after.text()
  }
  // parse major chunks
  after = byClause(after)
  if (isGood(after, options)) {
    return after.text()
  }
  // perform some modifications
  after = safeCut(after)
  if (isGood(after, options)) {
    return after.text()
  }
  // really give it a go
  after = hardCut(after)
  if (isGood(after, options)) {
    console.log(after.text())
    count += 1
    console.log(count)
    return after.text()
  }
  // console.log(after.match('#PastTense').text())
  // console.log(after.text())
  // console.log('\n')
  return ''
}
module.exports = doSentence
