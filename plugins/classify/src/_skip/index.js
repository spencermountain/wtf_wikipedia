const skip = {
  disambiguation: true,
  surname: true,
  name: true,
  'given name': true
}
const paren = /\((.*)\)$/
const listOf = /^list of ./
const disambig = /\(disambiguation\)/

const skipPage = function(doc) {
  let title = doc.title() || ''

  //look at parentheses like 'Tornado (film)'
  let m = title.match(paren)
  if (!m) {
    return null
  }
  let inside = m[1] || ''
  inside = inside.toLowerCase()
  inside = inside.replace(/_/g, ' ')
  inside = inside.trim()

  //look at known parentheses
  if (skip.hasOwnProperty(inside)) {
    return true
  }
  //try a regex
  if (listOf.test(title) === true) {
    return true
  }
  if (disambig.test(title) === true) {
    return true
  }
  return false
}
module.exports = skipPage
