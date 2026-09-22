import byInfobox from '../getInfobox.js'

const deathPlace = function (doc) {
  const res = byInfobox(doc, 'death_place')
  if (res) {
    return res
  }
  return null
}
export default deathPlace
