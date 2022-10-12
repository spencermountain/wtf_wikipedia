import byInfobox from '../getInfobox.js'

function deathPlace (doc) {
  let res = byInfobox(doc, 'death_place')
  if (res) {
    return res
  }
  return null
}
export default deathPlace
