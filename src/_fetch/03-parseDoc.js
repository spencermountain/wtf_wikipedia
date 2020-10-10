const Document = require('../01-document/Document')

// flip response object into proper Doc objs
const parseDoc = function(res) {
  res = res.filter(o => o)
  let docs = res.map(o => {
    return new Document(o.wiki, o.meta)
  })
  if (docs.length === 0) {
    return null
  }
  if (docs.length === 1) {
    return docs[0]
  }
  return docs
}
module.exports = parseDoc
