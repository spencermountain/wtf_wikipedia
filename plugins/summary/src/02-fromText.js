const nlp = require('compromise')

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

const removeTitle = function(s, sentence, title) {
  //remove bolds (longest-first)
  let bolds = sentence.bolds().sort((a, b) => {
    if (a.length > b.length) {
      return -1
    }
    return 1
  })
  bolds.forEach(b => {
    s = s.not(b)
  })
  s = s.not('^#Noun+ #Copula')
  s = s.not(`^${title}`)
  return s
}

//use commas, etc
const byClause = function(s, options) {
  let clauses = s.clauses()
  // remove any clause with 'is/was'
  clauses.ifNo('#Copula')
  // try just removing the last clause
  if (clauses.length > 1 && clauses.text().length > options.max) {
    clauses.pop()
  }
  return clauses.join()
}

// truncate a list of descriptions
const popList = function(s, options) {
  let txt = s.text()
  let almostMax = options.max * 0.75
  if (txt.length > almostMax && s.has('and')) {
    s = s.remove('and .*')
  }
  return s
}

const byTemplate = function(s, options) {
  let txt = s.text()
  let almostMax = options.max * 0.75
  if (txt.length > almostMax) {
    s.remove('(located|born) in .*')
  }
  return s
}

const byWord = function(s, options) {
  let txt = s.text()
  let almostMax = options.max * 0.8
  if (txt.length > almostMax) {
    s.remove('#Demonym') //'american'
    s.remove('(retired|former|professional|amateur)')
  }
  return s
}

//check text is appropriate length
const isGood = function(text, options) {
  if (text && text.length > options.min && text.length < options.max) {
    return true
  }
  return false
}

const popArticle = function(doc) {
  doc.remove('^(a|an|the)')
  return doc
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
  s = removeTitle(s, sentence, title)
  //by comma-section
  s = byClause(s, options)
  //remove end period
  s.post('')
  // truncate a list
  s = popList(s, options)
  // remove known sub-phrases
  s = byTemplate(s, options)
  // remove needless words
  s = byWord(s, options)
  //remove article
  if (options.article === false) {
    s = popArticle(s)
  }
  //spit-out the text
  let text = s.trim().out('text')
  if (isGood(text, options) === true) {
    return text
  }
  return ''
}
module.exports = extract
