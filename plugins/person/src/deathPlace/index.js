const byInfobox = require('../getInfobox')

const deathPlace = function (doc) {
  let res = byInfobox(doc, 'death_place')
  if (res) {
    return res
  }
  return null
}
module.exports = deathPlace
