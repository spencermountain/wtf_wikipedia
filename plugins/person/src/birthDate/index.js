import byInfobox from '../getInfobox.js'
import bySentence from '../getSentence.js'
import byCategory from './byCategory.js'
import parseDate from '../parseDate.js'

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
export default birthDate
