const mapping = require('./mapping')

const byInfobox = function (doc) {
  let infoboxes = doc.infoboxes()
  let found = []
  for (let i = 0; i < infoboxes.length; i++) {
    let inf = infoboxes[i]
    let type = inf.type()

    type = type.toLowerCase()
    // type = type.replace(/^(category|categorie|kategori): ?/i, '')
    type = type.replace(/ /g, '_')
    type = type.trim()

    if (mapping.hasOwnProperty(type)) {
      found.push({ cat: mapping[type], reason: type })
    }
  }
  return found
}
module.exports = byInfobox
