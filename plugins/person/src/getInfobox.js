import mapping from './_lib/_infoboxes.js'

function byInfobox (doc, prop) {
  let infoboxes = doc.infoboxes()
  for (let i = 0; i < infoboxes.length; i++) {
    let inf = infoboxes[i]
    let type = inf.type()
    type = type.toLowerCase()
    type = type.trim()

    if (mapping.hasOwnProperty(type)) {
      let s = inf.get(prop)
      if (s) {
        return s.text()
      }
    }
  }
  return null
}
export default byInfobox
