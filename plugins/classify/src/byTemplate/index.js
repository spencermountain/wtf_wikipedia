const { patterns, mappings } = require('../../schema/_data-fns')
const byPattern = require('../_byPattern')

const byTemplate = function (doc) {
  let templates = doc.templates()
  let found = []
  for (let i = 0; i < templates.length; i++) {
    const title = templates[i].template
    if (mappings.templates.hasOwnProperty(title)) {
      found.push({ type: mappings.templates[title], reason: title })
    } else {
      // try regex-list on it
      let type = byPattern(title, patterns.templates)
      if (type) {
        found.push({ type: type, reason: title })
      }
    }
  }
  return found
}

module.exports = byTemplate
