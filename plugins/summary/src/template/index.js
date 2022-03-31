const fromTemplate = function (doc) {
  let tmpl = doc.template('short description')
  if (tmpl) {
    let json = tmpl.json() || {}
    return json.description || ''
  }
  return null
}
export default fromTemplate
