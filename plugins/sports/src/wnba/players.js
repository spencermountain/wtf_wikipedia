import { findSection, withChildren } from '../_lib.js'

// the roster is one {{sports roster}} holding {{sports roster/entry}} rows
const parseRoster = function (doc) {
  const s = findSection(doc, ['roster', 'current roster'])
  if (!s) {
    return []
  }
  const entries = withChildren(doc, s).flatMap((c) => c.templates('sports roster/entry'))
  return entries
    .map((tmpl) => ({ ...tmpl.json().data }))
    .filter((p) => p.num !== undefined) //coach + trainer entries have no number
}

export { parseRoster }
