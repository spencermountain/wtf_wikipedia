import { patterns, mappings } from '../../schema/_data-fns.js'
import byPattern from '../_byPattern.js'
const paren = /\((.*)\)$/

function byTitle (doc) {
  let title = doc.title()
  if (!title) {
    return []
  }
  //look at parentheses like 'Tornado (film)'
  let m = title.match(paren)
  if (!m) {
    return []
  }
  let inside = m[1] || ''
  inside = inside.toLowerCase()
  inside = inside.replace(/_/g, ' ')
  inside = inside.trim()

  //look at known parentheses
  if (mappings.titles.hasOwnProperty(inside)) {
    return [{ type: mappings.titles[inside], reason: inside }]
  }

  // look at regex
  let match = byPattern(title, patterns.titles)
  if (match) {
    return [{ type: match, reason: title }]
  }
  return []
}
export default byTitle
