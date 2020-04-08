const preProcess = function (doc) {
  doc.parentheses().remove()
  return doc
}
module.exports = preProcess
