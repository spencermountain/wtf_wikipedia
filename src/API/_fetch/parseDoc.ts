import Document from '../01-document/Document.ts'
import parse from '../../parse/index.ts'
import { isArray } from '../../_lib/helpers.ts'

// the same title-form we send to the api
const normTitle = (t) => String(t).replace(/ /g, '_').trim()

// return pages in the same order their titles or pageids were asked-for
const sortByInput = function (found, input) {
  const order = {}
  input.forEach((t, i) => {
    const key = normTitle(t)
    if (order[key] === undefined) {
      order[key] = i
    }
  })
  const byId = typeof input[0] === 'number'
  const indexOf = function (o) {
    const key = byId ? String(o.meta?.pageId) : normTitle(o.requested ?? o.meta?.title ?? '')
    return order[key] ?? Infinity
  }
  return found.sort((a, b) => indexOf(a) - indexOf(b))
}

const parseDoc = function (res, title) {
  let found = (res ?? []).filter((o) => o != null)
  if (isArray(title)) {
    found = sortByInput(found, title)
  }
  const results = found.map((o) => {
    // Fetch and direct input share the same plain-data parsing pipeline.
    const data = parse(o.wiki ?? '', o.meta)
    return new Document(data, o.meta)
  })

  return isArray(title) ? results : (results[0] ?? null)
}
export default parseDoc
