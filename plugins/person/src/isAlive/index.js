import byCat from './byCategory.js'
import byTemplate from './byTemplate.js'

// maximum age of a person
const d = new Date()
const minYear = d.getFullYear() - 105

const isAlive = function (doc) {
  // if we have a death date
  const death = doc.deathDate()
  if (death) {
    return false
  }
  // if we have a death place
  const deathPlace = doc.deathPlace()
  if (deathPlace) {
    return false
  }
  // does it have a good category?
  const fromCat = byCat(doc)
  if (fromCat === true || fromCat === false) {
    return fromCat
  }
  // does it have a good template?
  const fromTemplate = byTemplate(doc)
  if (fromTemplate === true || fromTemplate === false) {
    return fromTemplate
  }
  // were they born in 1900?
  const birth = doc.birthDate()
  if (birth && birth.year && birth.year < minYear) {
    return true
  }
  return null
}
export default isAlive
