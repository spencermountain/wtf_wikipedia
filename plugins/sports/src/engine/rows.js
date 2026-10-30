import { withChildren } from '../_lib.js'

// one normalized row: {cells: {key: text}, links: {key: page}, attrs: 'style=..'}
const fromTable = function (table) {
  const jsonRows = table.json().rows || [] //keeps per-cell links
  const simpleRows = table.rows() //keeps row _attrs
  return jsonRows.map((row, i) => {
    const cells = {}
    const links = {}
    Object.keys(row).forEach((k) => {
      cells[k] = row[k].text || ''
      const cellLinks = row[k].links
      if (cellLinks && cellLinks[0] && cellLinks[0].page) {
        links[k] = cellLinks[0].page
      }
    })
    return { cells, links, attrs: simpleRows[i]?._attrs || '' }
  })
}

const fromTemplate = function (tmpl) {
  const rows = tmpl.json().data?.rows || []
  return rows.map((row) => {
    const { rowLinks, rowAttrs, ...cells } = row
    return { cells, links: rowLinks || {}, attrs: rowAttrs || '' }
  })
}

// each table or game-log template in the section becomes one group of rows
// a `skip` regex drops matching subsections and everything nested under them
const rowGroups = function (doc, section, skip) {
  const groups = []
  let skipBelow = null
  withChildren(doc, section).forEach((s, i) => {
    if (i > 0 && skip) {
      if (skipBelow !== null && s.depth() > skipBelow) {
        return
      }
      skipBelow = null
      if (skip.test(s.title())) {
        skipBelow = s.depth()
        return
      }
    }
    s.tables().forEach((t) => groups.push(fromTable(t)))
    s.templates('game log section').forEach((t) => groups.push(fromTemplate(t)))
  })
  return groups.filter((rows) => rows.length > 0)
}
export default rowGroups
