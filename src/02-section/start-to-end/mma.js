const tableParser = require('../../table/parse')
let headings = ['res', 'record', 'opponent', 'method', 'event', 'date', 'round', 'time', 'location', 'notes']

//https://en.wikipedia.org/wiki/Template:MMA_record_start
const parseMMA = function(section) {
  let wiki = section.wiki
  wiki = wiki.replace(/\{\{mma record start[\s\S]+?\{\{end\}\}/gi, tmpl => {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '')
    tmpl = tmpl.replace(/\{\{end\}\}/i, '')
    let headers = '! ' + headings.join(' !! ')
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}'
    let rows = tableParser(table)
    rows = rows.map(row => {
      Object.keys(row).forEach(k => {
        row[k] = row[k].text()
      })
      return row
    })
    section.templates.push({
      template: 'mma record start',
      data: rows
    })
    return ''
  })
  section.wiki = wiki
}
module.exports = parseMMA
