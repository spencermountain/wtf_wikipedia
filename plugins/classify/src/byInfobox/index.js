import { mappings } from '../../schema/_data-fns.js'

const byInfobox = function (doc) {
  const infoboxes = doc.infoboxes()
  const found = []
  for (let i = 0; i < infoboxes.length; i++) {
    const inf = infoboxes[i]
    let type = inf.type()

    type = type.toLowerCase()
    // type = type.replace(/^(category|categorie|kategori): ?/i, '')
    type = type.replace(/ /g, '_')
    type = type.trim()

    if (mappings.infoboxes.hasOwnProperty(type)) {
      found.push({ type: mappings.infoboxes[type], reason: type })
    }
  }
  return found
}
export default byInfobox
