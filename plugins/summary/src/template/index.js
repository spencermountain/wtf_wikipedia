const fromTemplate = function (doc) {
  const tmpl = doc.template('short description')
  if (tmpl) {
    const json = tmpl.json() || {}
    return json.description || ''
  }
  return null
}
export default fromTemplate
