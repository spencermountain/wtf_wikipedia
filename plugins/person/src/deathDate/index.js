import byInfobox from '../getInfobox.js'
import bySentence from '../getSentence.js'
import byCategory from './byCategory.js'
import parseDate from '../parseDate.js'

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
export default deathDate
