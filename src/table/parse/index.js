import { fromText as parseSentence } from '../../04-sentence/index.js'
import findRows from './_findRows.js'
import handleSpans from './_spans.js'
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
const cleanText = function (str) {
  str = parseSentence(str).text()
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.*?\| ?/, '') //class="unsortable"|title
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
  row = row || []
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

//turn headers, array into an object
const parseRow = function (arr, headers) {
  let row = {}
  arr.forEach((str, i) => {
    let h = headers[i] || 'col' + (i + 1)
    let s = parseSentence(str)
    s.text(cleanText(s.text()))
    row[h] = s
  })
  return row
}

//should we use the first row as a the headers?
const firstRowHeader = function (rows) {
  if (rows.length <= 3) {
    return []
  }
  let headers = rows[0].slice(0)
  headers = headers.map((h) => {
    h = h.replace(/^! */, '')
    h = parseSentence(h).text()
    h = cleanText(h)
    h = h.toLowerCase()
    return h
  })
  for (let i = 0; i < headers.length; i += 1) {
    if (headings.hasOwnProperty(headers[i])) {
      rows.shift()
      return headers
    }
  }
  return []
}

//turn a {|...table string into an array of arrays
const parseTable = function (wiki) {
  let lines = wiki
    .replace(/\r/g, '')
    .replace(/\n(\s*[^|!{\s])/g, ' $1') //remove unecessary newlines
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
  let headers = findHeaders(rows)
  if (!headers || headers.length <= 1) {
    headers = firstRowHeader(rows)
    let want = rows[rows.length - 1] || []
    //try the second row
    if (headers.length <= 1 && want.length > 2) {
      headers = firstRowHeader(rows.slice(1))
      if (headers.length > 0) {
        rows = rows.slice(2) //remove them
      }
    }
  }
  //index each column by it's header
  let table = rows.map((arr) => {
    return parseRow(arr, headers)
  })
  return table
}

export default parseTable
