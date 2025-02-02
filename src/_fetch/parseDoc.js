import Document from '../01-document/Document.js'
import { isArray } from '../_lib/helpers.js'
/**
 * this function puts all responses into proper Document objects
 *
 * @private
 * @param {Array} res
 * @param {string | number | Array<number> | Array<string>} title
 * @returns {null| Document | Document[]} null if there are no results or Document if there is one responses and Document array if there are multiple responses
 */
const parseDoc = function (res, title) {
  res = res || []
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
  if (!isArray(title) && docs.length === 1) {
    return docs[0]
  }

  return docs
}
export default parseDoc
