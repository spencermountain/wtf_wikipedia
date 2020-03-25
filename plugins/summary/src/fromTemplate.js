const isObject = function(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}
const fromTemplate = function(doc) {
  let tmpl = doc.template('short description')
  if (tmpl && isObject(tmpl) && tmpl.description) {
    return tmpl.description
  }
  return null
}
module.exports = fromTemplate
