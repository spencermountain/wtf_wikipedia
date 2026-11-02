import byInfobox from '../getInfobox.js'
import parsePredicate from '../_lib/_predicate.js'

// 'was an American professional golfer' → 'American'
const bySentence = function (doc) {
  const found = parsePredicate(doc)
  if (!found || !found.demonym) {
    return null
  }
  // long matches are usually not demonyms, like 'Major League Baseball'
  if (found.demonym.split(' ').length > 2) {
    return null
  }
  return found.demonym
}

const getNationality = function (doc) {
  const res = byInfobox(doc, ['nationality', 'citizenship'])
  if (res) {
    return res
  }
  return bySentence(doc)
}
export default getNationality
