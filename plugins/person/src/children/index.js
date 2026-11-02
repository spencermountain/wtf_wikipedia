import { getField } from '../getInfobox.js'

// the children field is a count, a list of names, or both - '11, including [[Bob]]'
const children = function (doc) {
  const block = getField(doc, ['children', 'issue'])
  if (!block) {
    return null
  }
  const text = block.text()
  const count = (text.match(/^(\d+)\b/) || [])[1]
  let names = block.links().map((l) => l.text() || l.page())
  if (names.length === 0 && !count) {
    // unlinked names, like 'Jane, John'
    names = text
      .split(/[·,\n]/)
      .map((s) => s.trim())
      .filter((s) => s)
  }
  let n = null
  if (count) {
    n = parseInt(count, 10)
  } else if (names.length > 0) {
    n = names.length
  }
  return { count: n, names: names }
}
export default children
