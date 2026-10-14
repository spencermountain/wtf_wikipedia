import mapping from './_lib/_infoboxes.js'

const byInfobox = function (doc, prop) {
  const infoboxes = doc.infoboxes()
  for (let i = 0; i < infoboxes.length; i++) {
    const inf = infoboxes[i]
    let type = inf.type()
    type = type.toLowerCase()
    type = type.trim()

    if (Object.hasOwn(mapping, type)) {
      const s = inf.get(prop)
      if (s) {
        return s.text()
      }
    }
  }
  return null
}
export default byInfobox
