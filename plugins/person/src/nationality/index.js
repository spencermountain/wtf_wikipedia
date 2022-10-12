import byInfobox from '../getInfobox.js'

function getNationality (doc) {
  let res = byInfobox(doc, 'nationality')
  if (res) {
    return res
  }
  return null
}
export default getNationality
