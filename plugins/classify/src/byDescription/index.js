const byDescription = function (doc) {
  let tmpl = doc.template('short description')
  if (tmpl && tmpl.description) {
    let desc = tmpl.description
  }
  return []
}
module.exports = byDescription
