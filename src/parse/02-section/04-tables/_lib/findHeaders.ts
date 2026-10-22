import cleanText from './cleanText.ts'
import skipSpanRow from './skipSpanRow.ts'

// Consume explicit header rows, allowing a second row to override labels.
const findHeaders = function (rows = []) {
  let headers = []

  // is the first-row just a ton of colspan?
  if (skipSpanRow(rows[0])) {
    rows.shift()
  }

  let first = rows[0]
  if (first && first[0] && first[1] && (/^!/.test(first[0]) || /^!/.test(first[1]))) {
    headers = first.map((h) => {
      h = h.replace(/^! */, '')
      h = cleanText(h)
      return h
    })
    rows.shift()
  }
  //try the second row, too (overwrite first-row, if it exists)
  first = rows[0]
  if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
    first.forEach((h, i) => {
      h = h.replace(/^! */, '')
      h = cleanText(h)
      if (Boolean(h) === true) {
        headers[i] = h
      }
    })
    rows.shift()
  }
  return headers
}

export default findHeaders
