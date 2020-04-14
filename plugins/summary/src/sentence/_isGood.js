//check text is appropriate length
const isGood = function (doc, options) {
  if (doc && typeof doc.text === 'function') {
    let text = doc.text()
    if (text && text.length > options.min && text.length < options.max) {
      return true
    }
  }
  return false
}
module.exports = isGood
