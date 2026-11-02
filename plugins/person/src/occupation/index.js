import byInfobox from '../getInfobox.js'

// split an infobox list - hlist renders with '·'
const splitList = function (str) {
  return str
    .split(/[·,;\n]| and /)
    .map((s) => s.trim())
    .filter((s) => s)
}

// '... is an American professional golfer.' → ['professional golfer']
const bySentence = function (doc) {
  const s = doc.sentences()[0]
  if (!s) {
    return []
  }
  const m = s.text().match(/\b(?:is|was) (?:an?|the) ([^.,;]+)/)
  if (!m) {
    return []
  }
  // cut trailing clauses
  const phrase = m[1].split(/ (?:who|that|known|best|famous|from|based) /)[0]
  const words = phrase.trim().split(/ +/)
  // drop leading demonyms, like 'American' in 'American professional golfer'
  while (words.length > 1 && /^[A-Z]/.test(words[0])) {
    words.shift()
  }
  if (words.length === 0 || /^[A-Z]/.test(words[0])) {
    return []
  }
  return splitList(words.join(' '))
}

const occupation = function (doc) {
  const str = byInfobox(doc, ['occupation', 'occupations', 'profession', 'professions'])
  if (str) {
    return splitList(str)
  }
  return bySentence(doc)
}
export default occupation
