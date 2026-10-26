import makeResult from '../../templates/result.ts'
import defaults from '../../../_lib/defaults.ts'
import tableParser from '../05-tables/parse.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'
let headings = ['res', 'record', 'opponent', 'method', 'event', 'date', 'round', 'time', 'location', 'notes']

//https://en.wikipedia.org/wiki/Template:MMA_record_start
const parseMMA = function (section: SectionData, opts: DocInfo = defaults) {
  section.remaining = section.remaining.replace(/\{\{mma record start.+?\{\{end\}\}/gis, (tmpl) => {
    const wiki = tmpl
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '')
    tmpl = tmpl.replace(/\{\{end\}\}/i, '')

    let headers = '! ' + headings.join(' !! ')
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}'
    let rows = tableParser(table, opts).rows || []
    rows = rows.map((row) => {
      Object.keys(row).forEach((k) => {
        row[k] = row[k].text
      })
      return row
    })

    section.templates.push(makeResult(wiki, 'mma record start', { rows }, '', opts))

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}
export default parseMMA
