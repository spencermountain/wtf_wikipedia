const cleanUp = function (s) {
  // 'an actor and was a politician'
  s = s.remove('and #Copula .*')
  return s
}

//  founded in 1952 as the flagship ..
const findPivot = function (s) {
  let m = s.matchOne('#Copula+ (a|an|the|any|one) of?')
  if (!m.found) {
    m = s.matchOne('#Copula+')
  }
  if (!m.found) {
    m = s.matchOne('refers to (a|an|the|any)? of?')
  }
  if (!m.found) {
    m = s.matchOne('(constitutes|describes) (a|an|the|any)? of?')
  }
  if (!m.found) {
    return null
  }
  let f = s.splitOn(m)
  let verb = f.eq(1)
  // grab the article from the pivot, before any mutation -
  // in compromise v14, .remove() shifts the other views' pointers
  let article = verb.match(`(a|an|the|any)? of?`)
  return {
    before: f.eq(0),
    verb: verb,
    article: article,
    after: cleanUp(f.eq(2)),
  }
}
export default findPivot
