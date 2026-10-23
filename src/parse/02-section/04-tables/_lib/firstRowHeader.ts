import parseBlock from '../../../block/index.ts'
import cleanText from './cleanText.ts'

const headings = {
  name: true,
  age: true,
  born: true,
  date: true,
  year: true,
  city: true,
  country: true,
  population: true,
  count: true,
  number: true,
}

// Consume the first row when it contains a familiar column heading.
const firstRowHeader = function (rows, opts) {
  if (rows.length <= 3) {
    return []
  }
  let headers = rows[0].slice(0)
  headers = headers.map((h) => {
    h = h.replace(/^! */, '')
    h = cleanText(h)
    return parseBlock(h, opts)
  })
  for (let i = 0; i < headers.length; i += 1) {
    if (Object.hasOwn(headings, headers[i].text.toLowerCase())) {
      rows.shift()
      return headers
    }
  }
  return []
}

export default firstRowHeader
