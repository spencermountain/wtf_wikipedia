import { patterns, mappings } from '../../schema/_data-fns.js'
import byPattern from '../_byPattern.js'

function byTemplate (doc) {
  let templates = doc.templates().map((tmpl) => tmpl.json())
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

export default byTemplate
