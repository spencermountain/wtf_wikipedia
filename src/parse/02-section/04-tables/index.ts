import parseTable from './parse.ts'
import type { SectionData, DocInfo, TableData } from '../../../types/index.ts'

//const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70k chars.
const openReg = /^\s*\{\|/
const closeReg = /^\s*\|\}/

//tables can be recursive, so looky-here.
const findTables = function (section: SectionData, opts?: DocInfo) {
  let list = []
  let wiki = section.remaining
  let lines = wiki.split('\n')
  let stack = []
  for (let i = 0; i < lines.length; i += 1) {
    //start a table
    if (openReg.test(lines[i]) === true) {
      stack.push(lines[i])
      continue
    }
    //close a table
    if (closeReg.test(lines[i]) === true) {
      stack[stack.length - 1] += '\n' + lines[i]
      let table = stack.pop()
      list.push(table)
      continue
    }
    //keep-going on one
    if (stack.length > 0) {
      stack[stack.length - 1] += '\n' + lines[i]
    }
  }
  //work-em together for a Table class
  let tables: TableData[] = []
  list.forEach((str) => {
    if (str) {
      //also re-remove a newline at the end of the table (awkward)
      wiki = wiki.replace(str + '\n', '')
      wiki = wiki.replace(str, '')
      const { headers, rows } = parseTable(str, opts)
      if (rows && rows.length > 0) {
        const table: TableData = {
          wiki: str,
          rows: rows,
          headers: headers,
        }
        tables.push(table)
      }
    }
  })

  if (tables.length > 0) {
    section.tables = tables
  }
  section.remaining = wiki
  return section
}

export default findTables
