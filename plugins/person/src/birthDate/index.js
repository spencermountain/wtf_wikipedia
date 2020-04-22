const byInfobox = require('../getInfobox')
const bySentence = require('../getSentence')
const byCategory = require('./byCategory')
const parseDate = require('../parseDate')

const birthDate = function (doc) {
  let res = byInfobox(doc, 'birth_date')
  if (res) {
    return parseDate(res)
  }

  // try parentheses in first sentence
  res = bySentence(doc)
  if (res && res.birth) {
    return parseDate(res.birth)
  }

  // try to get year from 'Category:1955 births'
  let year = byCategory(doc)
  if (year) {
    return { year: year }
  }
  return null
}
module.exports = birthDate
