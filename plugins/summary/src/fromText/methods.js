//use commas, etc
exports.byClause = function(s, options) {
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
exports.popList = function(s) {
  if (s.has('#Noun and (a|an|the)')) {
    s = s.remove('and .*')
  }
  return s
}

exports.byTemplate = function(s, options) {
  s.remove('born in .*')
  s.remove('(first|initially|originally)? (located|founded|started|based|formed) in .*')
  s.remove('born #Date+ in? #Place+?')
  s.remove('(which|who|that) (is|was) .*')
  s.remove('^the name of')
  s.remove('(located|situated|sited|found|discovered) (in|on) .*')
  let txt = s.text()
  let almostMax = options.max * 0.75
  if (txt.length > almostMax) {
    // in california
    s.remove('in #Place+')
  }
  return s
}

exports.byWord = function(s, options) {
  let txt = s.text()
  let almostMax = options.max * 0.8
  if (txt.length > almostMax) {
    s.remove('#Demonym') //'american'
    s.remove('(retired|former|professional|amateur)')
  }
  return s
}

exports.popArticle = function(doc) {
  doc.remove('^(a|an|the)')
  return doc
}

exports.noSuperlative = function(s, options) {
  let txt = s.text()
  let almostMax = options.max * 0.7
  if (txt.length > almostMax) {
    s.remove('^one of (the|many|several|#Value)+')
    s.remove('^(a|an|the) #Ordinal? #Superlative')
    s.remove('^(a|an|the) #Ordinal? most #Adjective')
  }
  return s
}
