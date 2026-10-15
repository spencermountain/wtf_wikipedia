import tableParser from '../../../API/table/parse/index.ts'
//https://en.wikipedia.org/wiki/Template:MLB_game_log_section

//this is pretty nuts
const whichHeadings = function (tmpl) {
  let headings = ['#', 'date', 'opponent', 'score', 'win', 'loss', 'save', 'attendance', 'record']
  if (/\|stadium=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'stadium') //save, stadium, attendance
  }
  if (/\|time=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'time') //save, time, stadium, attendance
  }
  if (/\|box=y/i.test(tmpl) === true) {
    headings.push('box') //record, box
  }
  return headings
}
const parseMlb = function (section) {
  section.remaining = section.remaining.replace(/\{\{mlb game log /gi, '{{game log ')
  section.remaining = section.remaining.replace(
    /\{\{game log (section|month).+?\{\{game log (section|month) end\}\}/gis,
    (tmpl) => {
      let headings = whichHeadings(tmpl)

      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '')
      tmpl = tmpl.replace(/\{\{game log (section|month) end\}\}/i, '')

      let headers = '! ' + headings.join(' !! ')
      let table = '{|\n' + headers + '\n' + tmpl + '\n|}'
      let rows = tableParser(table)
      rows = rows.map((row) => {
        Object.keys(row).forEach((k) => {
          row[k] = row[k].text()
        })
        return row
      })
      section.templates.push({
        template: 'mlb game log section',
        data: rows,
      })

      //return empty string to remove the template from the wiki text
      return ''
    }
  )
  return section
}
export default parseMlb
