import byInfobox from '../getInfobox.js'

const birthPlace = function (doc) {
  const res = byInfobox(doc, ['birth_place', 'birthplace'])
  if (res) {
    return res
  }
  return null
}
export default birthPlace
