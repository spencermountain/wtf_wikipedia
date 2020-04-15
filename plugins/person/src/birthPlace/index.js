const byInfobox = require('../getInfobox')

const birthPlace = function (doc) {
  let res = byInfobox(doc, 'birth_place')
  if (res) {
    return res
  }
  return null
}
module.exports = birthPlace
