import byInfobox from '../getInfobox.js'

const getNationality = function (doc) {
  const res = byInfobox(doc, 'nationality')
  if (res) {
    return res
  }
  return null
}
export default getNationality
