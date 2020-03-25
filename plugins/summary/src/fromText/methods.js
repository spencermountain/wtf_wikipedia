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
exports.popList = function(s, options) {
  if (s.has('#Noun and .')) {
    s = s.remove('and .*')
  }
  return s
}

exports.byTemplate = function(s, options) {
  // let txt = s.text()
  // let almostMax = options.max * 0.75
  // if (txt.length > almostMax) {
  s.remove('(located|born) in .*')
  s.remove('(which|who|that) (is|was) .*')
  // }
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
