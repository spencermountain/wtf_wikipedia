const byInfobox = require('../getInfobox')
const bySentence = require('../getSentence')
const byCategory = require('./byCategory')
const parseDate = require('../parseDate')

const deathDate = function (doc) {
  let res = byInfobox(doc, 'death_date')
  if (res) {
    return parseDate(res)
  }
  // try parentheses in first sentence
  res = bySentence(doc)
  if (res && res.death) {
    return parseDate(res.death)
  }

  // try to get year from 'Category:1955 deaths'
  let year = byCategory(doc)
  if (year) {
    return { year: year }
  }
  return null
}
module.exports = deathDate
