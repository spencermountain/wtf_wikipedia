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
  const demonym = []
  // leading capitalized adjectives are usually a nationality
  while (words.length > 1 && /^[A-Z]/.test(words[0])) {
    demonym.push(words.shift())
  }
  return { demonym: demonym.join(' '), words: words }
}
export default parsePredicate
