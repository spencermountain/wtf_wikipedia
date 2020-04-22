const byInfobox = require('../getInfobox')

const getNationality = function (doc) {
  let res = byInfobox(doc, 'nationality')
  if (res) {
    return res
  }
  return null
}
module.exports = getNationality
