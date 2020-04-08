const nlp = require('compromise')
const preProcess = require('./00-preProcess')
const findPivot = require('./01-Pivot')
const byClause = require('./02-byClause')
const safeCut = require('./03-safeCuts')
const hardCut = require('./04-hardCuts')
const lastTry = require('./05-lastTry')
const isGood = require('./_isGood')

const defaults = {
  max: 80,
  min: 3
}

const post = function (s) {
  s.remove('^(and|or|but)')
  s.remove('(and|or|but)$')
  s.post('') // remove trailing comma
  return s.text()
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
    return post(after)
  }
  // parse major chunks
  after = byClause(after)
  if (isGood(after, options)) {
    return post(after)
  }
  // perform some modifications
  after = safeCut(after)
  if (isGood(after, options)) {
    return post(after)
  }
  // really give it a go
  after = hardCut(after)
  if (isGood(after, options)) {
    return post(after)
  }
  // atleast we tried
  after = lastTry(after)
  if (isGood(after, options)) {
    return post(after)
  }
  console.log(after.text())
  count += 1
  console.log(count)
  // console.log(after.match('#PastTense').text())
  // console.log(after.text())
  // console.log('\n')
  return ''
}
module.exports = doSentence
