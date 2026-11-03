import mapping from './mapping.js'
import patterns from './patterns.js'
import byPattern from '../_byPattern.js'
const paren = /\(([^()]*)\)$/

const byTitle = function (doc) {
  const title = doc.title
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
  if (mapping.hasOwnProperty(inside)) {
    return [{ reason: mapping[inside], name: inside }]
  }

  // look at regex
  const match = byPattern(title, patterns)
  if (match) {
    return [{ reason: match, name: title }]
  }
  return []
}
export default byTitle
