import type { DocInfo } from '../../../../types/index.ts'
import defaults from '../../../../_lib/defaults.ts'
import parseBlock from '../../../block/index.ts'
import findRows from './_findRows.ts'
import handleSpans from './_spans.ts'
const isHeading = /^!/

//common ones
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

//additional table-cruft to remove before parseLine method
const cleanText = function (str, opts: DocInfo = defaults) {
  str = parseBlock(str, opts).text
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/^.*?\| ?/m, '') //class="unsortable"|title
  }
  str = str.replace(/style=['"].*?["']/, '')
  //'!' is used as a highlighed-column
  str = str.replace(/^!/, '')
  // str = str.replace(/\(.*?\)/, '')
  str = str.trim()
  // str = str.toLowerCase()
  return str
}

const skipSpanRow = function (row) {
  row ||= []
  let len = row.length
  let hasTxt = row.filter((str) => str).length
  //does it have 3 empty spaces?
  if (len - hasTxt > 3) {
    return true
  }
  return false
}

//remove non-header span rows
const removeMidSpans = function (rows) {
  rows = rows.filter((row) => {
    if (row.length === 1 && row[0] && isHeading.test(row[0]) && /rowspan/i.test(row[0]) === false) {
      return false
    }
    return true
  })
  return rows
}

//'!' starts a header-row
const findHeaders = function (rows = [], opts: DocInfo = defaults) {
  let headers = []

  // is the first-row just a ton of colspan?
  if (skipSpanRow(rows[0])) {
    rows.shift()
  }

  let first = rows[0]
  if (first && first[0] && first[1] && (/^!/.test(first[0]) || /^!/.test(first[1]))) {
    headers = first.map((h) => {
      h = h.replace(/^! */, '')
      h = cleanText(h, opts)
      return h
    })
    rows.shift()
  }
  //try the second row, too (overwrite first-row, if it exists)
  first = rows[0]
  if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
    first.forEach((h, i) => {
      h = h.replace(/^! */, '')
      h = cleanText(h, opts)
      if (Boolean(h) === true) {
        headers[i] = h
      }
    })
    rows.shift()
  }
  return headers
}

//turn headers, array into an object
const parseRow = function (arr, headers, opts: DocInfo = defaults) {
  let row = {}
  arr.forEach((str, i) => {
    let h = headers[i] || 'col' + (i + 1)
    let s = parseBlock(str, opts)
    s.text = cleanText(s.text, opts)
    row[h] = s
  })
  return row
}

//should we use the first row as a the headers?
const firstRowHeader = function (rows, opts: DocInfo = defaults) {
  if (rows.length <= 3) {
    return []
  }
  let headers = rows[0].slice(0)
  headers = headers.map((h) => {
    h = h.replace(/^! */, '')
    h = parseBlock(h, opts).text
    h = cleanText(h, opts)
    h = h.toLowerCase()
    return h
  })
  for (let i = 0; i < headers.length; i += 1) {
    if (Object.hasOwn(headings, headers[i])) {
      rows.shift()
      return headers
    }
  }
  return []
}

//turn a {|...table string into an array of arrays
const parseTable = function (wiki, opts: DocInfo = defaults) {
  let lines = wiki
    .replace(/\r/g, '')
    // Scan each whitespace run once, including runs before table markers.
    .replace(/\n\s*/g, (space, offset, text) => {
      const next = text[offset + space.length]
      return next && !'|!{'.includes(next) ? ' ' + space.slice(1) : space
    }) //remove unecessary newlines
    .split(/\n/)
    .map((l) => l.trim())
  let rows = findRows(lines)
  rows = rows.filter((r) => r)
  if (rows.length === 0) {
    return []
  }

  //remove non-header span rows
  rows = removeMidSpans(rows)
  //support colspan, rowspan...
  rows = handleSpans(rows)
  //grab the header rows
  let headers = findHeaders(rows, opts)
  if (!headers || headers.length <= 1) {
    headers = firstRowHeader(rows, opts)
    let want = rows.at(-1) || []
    //try the second row
    if (headers.length <= 1 && want.length > 2) {
      headers = firstRowHeader(rows.slice(1), opts)
      if (headers.length > 0) {
        rows = rows.slice(2) //remove them
      }
    }
  }
  //index each column by it's header
  let table = rows.map((arr) => {
    return parseRow(arr, headers, opts)
  })
  return table
}

export default parseTable
