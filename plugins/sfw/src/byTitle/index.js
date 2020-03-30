const mapping = require('./patterns')
const patterns = require('./patterns')
const byPattern = require('../_byPattern')
const paren = /\((.*)\)$/

const byTitle = function(doc) {
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
  if (mapping.hasOwnProperty(inside)) {
    return [{ reason: mapping[inside], title: inside }]
  }

  // look at regex
  let match = byPattern(title, patterns)
  if (match) {
    return [{ reason: match, title: title }]
  }
  return []
}
module.exports = byTitle
