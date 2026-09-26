import { patterns, mappings } from '../../schema/_data-fns.js'
import byPattern from '../_byPattern.js'

const byTemplate = function (doc) {
  const templates = doc.templates().map((tmpl) => tmpl.json())
  const found = []
  for (let i = 0; i < templates.length; i++) {
    const title = templates[i].template
    if (Object.hasOwn(mappings.templates, title)) {
      found.push({ type: mappings.templates[title], reason: title })
    } else {
      // try regex-list on it
      const type = byPattern(title, patterns.templates)
      if (type) {
        found.push({ type: type, reason: title })
      }
    }
  }
  return found
}

export default byTemplate
