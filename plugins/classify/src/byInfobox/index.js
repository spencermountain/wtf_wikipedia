const mapping = require('./infoboxes')

const byInfobox = function(doc) {
  let infoboxes = doc.infoboxes()
  for (let i = 0; i < infoboxes.length; i++) {
    let inf = infoboxes[i]
    let type = inf.type()

    type = type.toLowerCase()
    type = type.replace(/^(category|categorie|kategori): ?/i, '')
    type = type.replace(/ /g, '_')
    type = type.trim()
    console.log(type)

    if (mapping.hasOwnProperty(type)) {
      return mapping[type]
    }
  }
  return null
}
module.exports = byInfobox
