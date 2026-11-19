// parse the first-sentence predicate - 'was an American professional golfer'
// → { demonym: 'American', words: ['professional', 'golfer'] }
const parsePredicate = function (doc) {
  const s = doc.sentences()[0]
  if (!s) {
    return null
  }
  const m = s.text().match(/\b(?:is|was) (?:an?|the) ([^.,;]+)/)
  if (!m) {
    return null
  }
  // cut trailing clauses
  const phrase = m[1].split(/ (?:who|that|known|best|famous|from|based) /)[0]
  const words = phrase.trim().split(/ +/)
  // leading capitalized adjectives are usually a nationality
  let i = 0
  while (i < words.length - 1 && /^[A-Z]/.test(words[i])) {
    i += 1
  }
  return { demonym: words.slice(0, i).join(' '), words: words.slice(i) }
}
export default parsePredicate
