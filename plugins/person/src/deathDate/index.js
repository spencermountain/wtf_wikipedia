const byInfobox = require('../getInfobox')
const bySentence = require('../getSentence')

const deathDate = function (doc) {
  let res = byInfobox(doc, 'death_date')
  if (res) {
    return res
  }
  // try parentheses in first sentence
  res = bySentence(doc)
  if (res && res.death) {
    return res.death
  }
  return null
}
module.exports = deathDate
