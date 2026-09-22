import byInfobox from '../getInfobox.js'

const birthPlace = function (doc) {
  const res = byInfobox(doc, 'birth_place')
  if (res) {
    return res
  }
  return null
}
export default birthPlace
