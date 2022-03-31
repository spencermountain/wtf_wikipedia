import { patterns } from '../../schema/_data-fns.js'
import byPattern from '../_byPattern.js'

const byDescription = function (doc) {
  let tmpl = doc.template('short description')
  if (tmpl && tmpl.description) {
    let desc = tmpl.description || ''
    desc = desc.toLowerCase()
    // loop through our patterns
    let match = byPattern(desc, patterns.descriptions)
    if (match) {
      return [{ type: match, reason: desc }]
    }
  }
  return []
}
export default byDescription
