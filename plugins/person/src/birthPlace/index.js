import byInfobox from '../getInfobox.js'
import bySentence from './bySentence.js'
import byCategory from './byCategory.js'

const birthPlace = function (doc) {
  let res = byInfobox(doc, ['birth_place', 'birthplace'])
  if (res) {
    return res
  }
  // try 'born in ...' in the first sentence
  res = bySentence(doc)
  if (res) {
    return res
  }
  // try 'Category:People from ...'
  return byCategory(doc)
}
export default birthPlace
