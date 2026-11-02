import byInfobox from '../getInfobox.js'
import parsePredicate from '../_lib/_predicate.js'

// split an infobox list - hlist renders with '·'
const splitList = function (str) {
  return str
    .split(/[·,;\n]| and /)
    .map((s) => s.trim())
    .filter((s) => s)
}

// '... is an American professional golfer.' → ['professional golfer']
const bySentence = function (doc) {
  const found = parsePredicate(doc)
  if (!found || found.words.length === 0 || /^[A-Z]/.test(found.words[0])) {
    return []
  }
  return splitList(found.words.join(' '))
}

const occupation = function (doc) {
  const str = byInfobox(doc, ['occupation', 'occupations', 'profession', 'professions'])
  if (str) {
    return splitList(str)
  }
  return bySentence(doc)
}
export default occupation
