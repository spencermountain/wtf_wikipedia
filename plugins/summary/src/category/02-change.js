import nlp from 'compromise'

const useAn = function (str) {
  const a_regexs = [
    /^onc?e/i, //'wu' sound of 'o'
    /^u[bcfhjknq-t][aeiou]/i, // 'yu' sound for hard 'u'
    /^eul/i
  ]
  for (let i = 0; i < a_regexs.length; i++) {
    if (a_regexs[i].test(str)) {
      return false
    }
  }
  //basic vowel-startings
  if (/^[aeiou]/i.test(str)) {
    return true
  }
  return false
}

// 'American songwriters' to 'an American songwriter'
const changeCat = function (cat, options) {
  let c = nlp(cat)
  let hadCapital = c.terms().out('array').map((w) => /^[A-Z]/.test(w))
  c.nouns().toSingular()
  // compromise-14 lowercases words when it singularizes them - restore our capitals
  let terms = c.terms()
  hadCapital.forEach((had, i) => {
    if (had && terms.eq(i).found) {
      terms.eq(i).toTitleCase()
    }
  })
  // add article to the front
  if (options.article) {
    let article = 'A'
    // let noun = c.nouns(0)
    if (useAn(cat) === true) {
      // console.log(c.nouns(0))
      // article = c.nouns(0).json({ terms: false })[0].article || article
      article = 'An'
    }
    let first = c.terms(0)
    if (first.has('#ProperNoun') === false) {
      first.toLowerCase()
    }
    c.prepend(article)
  }
  // remove any parentheses
  c.parentheses().remove()
  return c.text()
}
export default changeCat
