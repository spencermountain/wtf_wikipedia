const mapping = {
  settlement: 'Place'
}

const byInfobox = function(doc) {
  let infoboxes = doc.infoboxes()
  for (let i = 0; i < infoboxes.length; i++) {
    let inf = infoboxes[i]
    let type = inf.type()
    if (mapping.hasOwnProperty(type)) {
      return mapping[type]
    }
  }
  return null
}
module.exports = byInfobox
