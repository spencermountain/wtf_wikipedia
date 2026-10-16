import Document from '../../API/01-document/Document.ts'
import { isArray } from '../../parse/_lib/helpers.ts'

const parseDoc = function (res, title) {
  const results = (res ?? []).filter((o) => o != null).map((o) => new Document(o.wiki, o.meta))

  return isArray(title) ? results : (results[0] ?? null)
}
export default parseDoc
