function preProcess (doc) {
  doc.parentheses().remove()
  return doc
}
export default preProcess
