const skip = {
  disambiguation: true,
  surname: true,
  name: true,
  'given name': true,
}
// Start once per line; the closing parenthesis must still end the whole title.
const paren = /^[^(\r\n\u2028\u2029]*\((.*)\)(?![\s\S])/m
const listOf = /^list of ./
const disambig = /\(disambiguation\)/

const skipPage = function (doc) {
  const title = doc.title() || ''

  //look at parentheses like 'Tornado (film)'
  const m = title.match(paren)
  if (!m) {
    return null
  }
  let inside = m[1] || ''
  inside = inside.toLowerCase()
  inside = inside.replace(/_/g, ' ')
  inside = inside.trim()

  //look at known parentheses
  if (Object.hasOwn(skip, inside)) {
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
export default skipPage
