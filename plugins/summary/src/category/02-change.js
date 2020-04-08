const nlp = require('compromise')
const titleCase = (str) => {
  return str.charAt(0).toUpperCase() + str.substr(1)
}

// 'American songwriters' to 'an American songwriter'
const changeCat = function (cat, options) {
  let c = nlp(cat)
  c.nouns().toSingular()
  // add article to the front
  if (options.article) {
    let article = 'A'
    let noun = c.nouns(0)
    if (noun && noun.found) {
      article = c.nouns(0).json({ terms: false })[0].article || article
      article = titleCase(article)
    }
    c.prepend(article)
  }
  return c.text()
}
module.exports = changeCat
