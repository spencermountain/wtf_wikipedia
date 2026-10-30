import parseGames from './parseGames/index.js'
import parseInfobox from './infobox.js'
import { withChildren, findSection, getCell } from '../_lib.js'

const parseTitle = function (season = '') {
  const num = season.match(/[0-9]+/) || []
  const year = Number(num[0]) || season
  const team = season
    .replace(/[0-9\-–]+/, '')
    .replace(/_/g, ' ')
    .replace(' season', '')
  return {
    year: year,
    season: season,
    team: team.trim(),
  }
}

const parseRoster = function (doc) {
  const s = findSection(doc, ['skaters', 'roster', 'player statistics'])
  let players = []
  if (!s) {
    return players
  }
  //do all subsections, too
  const tables = withChildren(doc, s).flatMap((c) => c.tables())
  if (!tables[0]) {
    return players
  }
  players = tables[0].rows().map((o) => {
    let name = getCell(o, ['player', 'Player', 'name', 'Name'])
    name = name.replace(/(^[^(\r\n\u2028\u2029]*)\(.*?\)/m, '$1')
    name = name.replace(/[‡†]/, '')
    name = name.trim()
    return {
      name: name,
      games: Number(getCell(o, ['gp', 'GP'])) || 0,
      goals: Number(getCell(o, ['g', 'G'])) || 0,
      assists: Number(getCell(o, ['a', 'A'])) || 0,
      points: Number(getCell(o, ['pts', 'Pts', 'PTS', 'points', 'Points'])) || 0,
      plusMinus: Number(getCell(o, ['+/−', '+/-'])) || 0,
    }
  })
  players = players.filter((o) => o && o.name && o.name !== 'Total')
  return players
}

//
const parse = function (doc) {
  const meta = parseTitle(doc.title || '')
  const res = {
    team: meta.team,
    year: meta.year,
    page: meta.season,
    roster: parseRoster(doc),
    season: parseInfobox(doc),
  }
  res.games = parseGames(doc, meta)
  return res
}
export default parse
