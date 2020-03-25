const mapping = require('./titles')

let patterns = {
  'CreativeWork/Film': [/ \([0-9]{4} film\)$/],
  CreativeWork: [/ \((.*? )song\)$/]
}
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
    return [mapping[inside]]
  }

  // look at regex
  let keys = Object.keys(patterns)
  for (let o = 0; o < keys.length; o++) {
    const k = keys[o]
    for (let i = 0; i < patterns[k].length; i++) {
      const reg = patterns[k][i]
      if (reg.test(title)) {
        return [k]
      }
    }
  }
  return []
}
module.exports = byTitle
