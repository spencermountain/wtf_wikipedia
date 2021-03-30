const { patterns } = require('../../schema/_data-fns')
const byPattern = require('../_byPattern')

const byDescription = function (doc) {
  let tmpl = doc.template('short description')
  if (tmpl && tmpl.description) {
    let desc = tmpl.description || ''
    desc = desc.toLowerCase()
    // loop through our patterns
    let match = byPattern(desc, patterns.descriptions)
    if (match) {
      return [{ type: match, reason: desc }]
    }
  }
  return []
}
module.exports = byDescription
