import byInfobox from '../getInfobox.js'

const getNationality = function (doc) {
  let res = byInfobox(doc, 'nationality')
  if (res) {
    return res
  }
  return null
}
export default getNationality
