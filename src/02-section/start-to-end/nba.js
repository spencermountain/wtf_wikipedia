import tableParser from '../../table/parse/index.js'
const keys = {
  coach: ['team', 'year', 'g', 'w', 'l', 'w-l%', 'finish', 'pg', 'pw', 'pl', 'pw-l%'],
  player: ['year', 'team', 'gp', 'gs', 'mpg', 'fg%', '3p%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg'],
  roster: ['player', 'gp', 'gs', 'mpg', 'fg%', '3fg%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg'],
}

/**
 * https://en.wikipedia.org/wiki/Template:NBA_player_statistics_start
 *
 * @private
 * @param {object} catcher
 */
const parseNBA = function (catcher) {
  catcher.text = catcher.text.replace(
    /\{\{nba (coach|player|roster) statistics start([\s\S]+?)\{\{s-end\}\}/gi,
    (tmpl, name) => {
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '')
      tmpl = tmpl.replace(/\{\{s-end\}\}/, '')
      name = name.toLowerCase().trim()

      let headers = '! ' + keys[name].join(' !! ')
      let table = '{|\n' + headers + '\n' + tmpl + '\n|}'
      let rows = tableParser(table)
      rows = rows.map((row) => {
        Object.keys(row).forEach((k) => {
          row[k] = row[k].text()
        })
        return row
      })

      catcher.templates.push({
        template: 'NBA ' + name + ' statistics',
        data: rows,
      })

      //return empty string to remove the template from the wiki text
      return ''
    }
  )
}
export default parseNBA
