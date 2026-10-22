import parseBlock from '../../block/index.ts'
import cleanText from './_lib/cleanText.ts'

const normalize = function (key = '') {
  key = key.toLowerCase()
  key = key.replace(/[_-]/g, ' ')
  key = key.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1')
  key = key.trim()
  return key
}

// Key each parsed cell by its header, falling back to a column number.
const parseRow = function (arr, headers) {
  let row = {}
  arr.forEach((str, i) => {
    let h = headers[i] || 'col' + (i + 1)
    h = normalize(h)

    let s = parseBlock(str)
    s.text = cleanText(s.text)
    row[h] = s
  })
  return row
}

export default parseRow
