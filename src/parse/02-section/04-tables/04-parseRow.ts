import parseBlock from '../../block/index.ts'
import cleanText from './_lib/cleanText.ts'
import { normalizeKey } from '../../../_lib/helpers.ts'

// Key each parsed cell by its header, falling back to a column number.
const parseRow = function (arr, headers, opts) {
  let row = {}
  arr.forEach((str, i) => {
    let h = headers[i]?.text || 'col' + (i + 1)
    h = normalizeKey(h)

    let s = parseBlock(str, opts)
    s.text = cleanText(s.text)
    row[h] = s
  })
  return row
}

export default parseRow
