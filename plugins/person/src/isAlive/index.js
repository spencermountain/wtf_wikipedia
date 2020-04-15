const maxAge = 105
let d = new Date()
const minYear = d.getFullYear() - maxAge

const didDie = {}
const byCat = function (doc) {
  let cats = doc.categories()

  if (doc.find((c) => c === 'Living People')) {
    return true
  }
}

const isAlive = function (doc) {
  // if we have a death date
  let death = doc.deathDate()
  if (death && death.year) {
    return true
  }
  // if we have a death place
  let deathPlace = doc.deathPlace()
  if (deathPlace) {
    return true
  }
  // does it have a good category?
  let fromCat = byCat(doc)
  if (fromCat === true || fromCat === false) {
    return fromCat
  }

  // were they born in 1900?
  let birth = doc.birthDate()
  if (birth && birth.year && birth.year < minYear) {
    return true
  }
  return null
}
module.exports = isAlive
