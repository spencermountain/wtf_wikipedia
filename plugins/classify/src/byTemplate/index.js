const patterns = require('./patterns')
const mapping = require('./mapping')
const byPattern = require('../_byPattern')

const byTemplate = function(doc) {
  let templates = doc.templates()
  let found = []
  for (let i = 0; i < templates.length; i++) {
    const title = templates[i].template
    if (mapping.hasOwnProperty(title)) {
      found.push({ cat: mapping[title], reason: title })
    } else {
      // try regex-list on it
      let type = byPattern(title, patterns)
      if (type) {
        found.push({ cat: type, reason: title })
      }
    }
  }
  return found
}

module.exports = byTemplate
