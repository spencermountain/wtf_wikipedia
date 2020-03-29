const patterns = require('./patterns')
// 1-1 template mapping
const mapping = require('./mapping')

const matchPatterns = function(title) {
  let types = Object.keys(patterns)
  for (let i = 0; i < types.length; i++) {
    const key = types[i]
    for (let o = 0; o < patterns[key].length; o++) {
      const reg = patterns[key][o]
      if (reg.test(title) === true) {
        return key
      }
    }
  }
  return null
}

const byTemplate = function(doc) {
  let templates = doc.templates()
  let found = []
  for (let i = 0; i < templates.length; i++) {
    const title = templates[i].template
    if (mapping.hasOwnProperty(title)) {
      found.push({ cat: mapping[title], reason: title })
    } else {
      // try regex-list on it
      let type = matchPatterns(title)
      if (type) {
        found.push({ cat: type, reason: title })
      }
    }
  }
  return found
}

module.exports = byTemplate
