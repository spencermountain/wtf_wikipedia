import patterns from './patterns.js'
import mapping from './mapping.js'
import byPattern from '../_byPattern.js'

const byTemplate = function (doc) {
  const templates = doc.templates()
  const found = []
  for (let i = 0; i < templates.length; i++) {
    const tmpl = templates[i]
    // wtf_wikipedia v10 returns Template objects; v8 returned plain json
    const data = typeof tmpl.json === 'function' ? tmpl.json() : tmpl
    const title = (data.template || '').trim().toLowerCase()
    // try our 1-to-1 mapping, then the regex-list
    let type = null
    if (mapping.hasOwnProperty(title)) {
      type = mapping[title]
    } else {
      type = byPattern(title, patterns)
    }
    if (type) {
      found.push({ reason: type, name: title, data: data })
    }
  }
  return found
}

export default byTemplate
