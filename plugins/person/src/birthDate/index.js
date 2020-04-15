const byInfobox = require('../getInfobox')
const bySentence = require('../getSentence')
const spacetime = require('spacetime')

const parseDate = function (str) {
  if (!str) {
    return null
  }
  // remove parentheses
  str = str.replace(/\(.*\)/, '')
  str = str.trim()
  // just the year
  if (str.match(/^[0-9]{4}$/)) {
    return {
      year: parseInt(str, 10)
    }
  }
  // parse the full date
  let s = spacetime(str)
  return {
    year: s.year(),
    month: s.month(),
    date: s.date()
  }
}

const birthDate = function (doc) {
  let res = byInfobox(doc, 'birth_date')
  if (res) {
    return parseDate(res)
  }

  // try parentheses in first sentence
  res = bySentence(doc)

  return {
    year: null,
    month: null,
    date: null
  }
}
module.exports = birthDate
