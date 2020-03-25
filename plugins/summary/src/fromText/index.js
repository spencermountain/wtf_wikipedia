const nlp = require('compromise')
const fn = require('./methods')
const noName = require('./noName')

nlp.extend(Doc => {
  Doc.prototype.pop = function() {
    this.list.pop()
    return this
  }
})

const defaults = {
  max: 90,
  min: 8
}

//check text is appropriate length
const isGood = function(text, options) {
  if (text && text.length > options.min && text.length < options.max) {
    return true
  }
  return false
}

//
const extract = function(doc, options) {
  options = options || {}
  options = Object.assign({}, defaults, options)
  let sentence = doc.sentences(0)
  if (!sentence) {
    return ''
  }
  let s = nlp(sentence.text())
  let title = doc.title() || ''
  //remove 'born-in' stuff
  s.parentheses().remove()
  //remove 'Toronto' from beginning
  s = noName(s, sentence, title)
  //by comma-section
  s = fn.byClause(s, options)
  //remove end period
  s.post('')
  // truncate a list
  s = fn.popList(s, options)
  // remove known sub-phrases
  s = fn.byTemplate(s, options)
  // remove needless words
  s = fn.byWord(s, options)
  //remove article
  if (options.article === false) {
    s = fn.popArticle(s)
  }
  //spit-out the text
  let text = s.trim().text()
  if (isGood(text, options) === true) {
    return text
  }
  return ''
}
module.exports = extract
