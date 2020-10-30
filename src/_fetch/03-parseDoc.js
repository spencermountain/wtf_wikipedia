const Document = require('../01-document/Document')
/**
 * this function puts all responses into proper Document objects
 *
 * @private
 * @param {Array} res
 * @returns {null| Document | Document[]} null if there are no results or Document if there is one responses and Document array if there are multiple responses
 */
const parseDoc = function (res) {
  res = res.filter((o) => o)
  let docs = res.map((o) => {
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
