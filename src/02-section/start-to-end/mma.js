import tableParser from '../../table/parse/index.js'
let headings = ['res', 'record', 'opponent', 'method', 'event', 'date', 'round', 'time', 'location', 'notes']

/**
 *
 * https://en.wikipedia.org/wiki/Template:MMA_record_start
 *
 * @private
 * @param {object} catcher
 */
const parseMMA = function (catcher) {
  catcher.text = catcher.text.replace(/\{\{mma record start[\s\S]+?\{\{end\}\}/gi, (tmpl) => {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '')
    tmpl = tmpl.replace(/\{\{end\}\}/i, '')

    let headers = '! ' + headings.join(' !! ')
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}'
    let rows = tableParser(table)
    rows = rows.map((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text()
      })
      return row
    })

    catcher.templates.push({
      template: 'mma record start',
      data: rows,
    })

    //return empty string to remove the template from the wiki text
    return ''
  })
}
export default parseMMA
