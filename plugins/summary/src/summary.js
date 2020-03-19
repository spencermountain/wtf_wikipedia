const compromise = require('compromise')

const defaults = {
  max: 200,
  min: 40
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
  let s = compromise(sentence.text())
  let title = doc.title() || ''
  //born-in junk
  s = s.not('#Parentheses')
  //by comma-section
  s = byClause(s)
  //remove 'Toronto' from beginning
  s = removeTitle(s, sentence, title)
  //remove end period
  s.setPunctuation('')
  //titlecase first letter
  s.words(0).toTitleCase()
  //spit-out the text
  let text = s.trim().out('text')
  if (isGood(text, options) === true) {
    return text
  }
  // s.debug()
  return ''
}
module.exports = extract
