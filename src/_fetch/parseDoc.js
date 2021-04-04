const Document = require('../01-document/Document')
/**
 * this function puts all responses into proper Document objects
 *
 * @private
 * @param {Array} res
 * @returns {null| Document | Document[]} null if there are no results or Document if there is one responses and Document array if there are multiple responses
 */
const parseDoc = function (res) {
  // filter out undefined
  res = res.filter((o) => o)


  // put all the responses into Document formats
  let docs = res.map((o) => {
    return new Document(o.wiki, o.meta)
  })

  // if the list is empty than there are no results
  if (docs.length === 0) {
    return null
  }
  
  // if there is only one response then we can get it out of the array
  if (docs.length === 1) {
    return docs[0]
  }

  return docs
}
module.exports = parseDoc
