const preProcess = function (doc) {
  doc.parentheses().remove()
  return doc
}
export default preProcess
