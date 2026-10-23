import splitLines from './01-splitLines.ts'
import findRows from './_findRows.ts'
import removeMidSpans from './02-removeMidSpans.ts'
import handleSpans from './_spans.ts'
import extractHeaders from './03-extractHeaders.ts'
import parseRow from './04-parseRow.ts'
import type { DocInfo } from '../../../types/index.ts'

const parseTable = (wiki: string, opts?: DocInfo) => {
  const lines = splitLines(wiki)
  let rows = findRows(lines).filter((row) => row)
  if (rows.length === 0) {
    return {}
  }

  rows = removeMidSpans(rows)
  rows = handleSpans(rows)
  const table = extractHeaders(rows, opts)
  return {
    headers: table.headers,
    rows: table.rows.map((row) => parseRow(row, table.headers, opts)),
  }
}

export default parseTable
