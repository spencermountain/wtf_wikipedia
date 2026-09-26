import { patterns, mappings } from '../../schema/_data-fns.js'
import byPattern from '../_byPattern.js'
// Start once per line; the closing parenthesis must still end the whole title.
const paren = /^[^(\r\n\u2028\u2029]*\((.*)\)(?![\s\S])/m

const byTitle = function (doc) {
  const title = doc.title()
  if (!title) {
    return []
  }
  //look at parentheses like 'Tornado (film)'
  const m = title.match(paren)
  if (!m) {
    return []
  }
  let inside = m[1] || ''
  inside = inside.toLowerCase()
  inside = inside.replace(/_/g, ' ')
  inside = inside.trim()

  //look at known parentheses
  if (Object.hasOwn(mappings.titles, inside)) {
    return [{ type: mappings.titles[inside], reason: inside }]
  }

  // look at regex
  const match = byPattern(title, patterns.titles)
  if (match) {
    return [{ type: match, reason: title }]
  }
  return []
}
export default byTitle
