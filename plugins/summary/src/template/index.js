const fromTemplate = function (doc) {
  const tmpl = doc.templates('short description')[0]
  if (tmpl) {
    const json = tmpl.json().data || {}
    return json.description || ''
  }
  return null
}
export default fromTemplate
