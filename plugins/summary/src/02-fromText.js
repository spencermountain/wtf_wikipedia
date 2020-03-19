const nlp = require('compromise')

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
const byClause = function(s) {
  let orig = s.clone()
  let clauses = s.clauses()
  for (let i = 0; i < clauses.length; i += 1) {
    let c = clauses.eq(i)
    if (c.has('#Copula')) {
      let result = clauses.slice(i, clauses.length)
      result = result.not('^#Copula')
      return result
    }
  }
  return orig
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
  s = byClause(s)
  //remove end period
  s.post('')
  // truncate a list
  s = popList(s, options)
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
