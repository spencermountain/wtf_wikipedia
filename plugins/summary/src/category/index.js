const chooseCat = require('./01-choose')
const change = require('./02-change')

const byCategory = function (doc, options) {
  let cat = chooseCat(doc, options)
  if (!cat) {
    return ''
  }
  return change(cat, options)
}
module.exports = byCategory
