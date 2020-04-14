const sections = require('./mapping')

const fromSection = function(doc) {
  let found = []
  let titles = doc.sections().map(s => {
    let str = s.title()
    str = str.toLowerCase().trim()
    return str
  })
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i]
    if (sections.hasOwnProperty(title)) {
      found.push({ cat: sections[title], reason: title })
    }
  }
  return found
}
module.exports = fromSection
