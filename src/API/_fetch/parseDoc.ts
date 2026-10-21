import Document from '../01-document/Document.ts'
import parse from '../../parse/index.ts'
import { isArray } from '../../_lib/helpers.ts'

const parseDoc = function (res, title) {
  const results = (res ?? []).filter((o) => o != null).map((o) => {
    // Fetch and direct input share the same plain-data parsing pipeline.
    const data = parse(o.wiki ?? '')
    return new Document(data, o.meta)
  })

  return isArray(title) ? results : (results[0] ?? null)
}
export default parseDoc
