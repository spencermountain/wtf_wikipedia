import splitLines from './01-splitLines.ts'
import findRows from './_findRows.ts'
import removeMidSpans from './02-removeMidSpans.ts'
import handleSpans from './_spans.ts'
import extractHeaders from './03-extractHeaders.ts'
import parseRow from './04-parseRow.ts'

const parseTable = (wiki: string) => {
  const lines = splitLines(wiki)
  let rows = findRows(lines).filter((row) => row)
  if (rows.length === 0) {
    return []
  }

  rows = removeMidSpans(rows)
  rows = handleSpans(rows)
  const table = extractHeaders(rows)
  return table.rows.map((row) => parseRow(row, table.headers))
}

export default parseTable
