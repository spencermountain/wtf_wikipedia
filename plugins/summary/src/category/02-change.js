import nlp from 'compromise'

function useAn (str) {
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
function changeCat (cat, options) {
  let c = nlp(cat)
  c.nouns().toSingular()
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
