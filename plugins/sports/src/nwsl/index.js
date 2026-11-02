import { getCell } from '../_lib.js'
import { findMatches } from '../engine/matches.js'
import parseInfobox from '../engine/infobox.js'
import { countRecord } from '../engine/record.js'
import resolveTeam from '../engine/teams.js'
import { oneYearTitle, parseOneYearTitle } from '../engine/slug.js'
import franchises from './franchises.js'

const makeTitle = oneYearTitle

const gameTitles = ['regular season', 'match results', 'matches', 'results']

// league matches only - cups, friendlies and the playoffs parse separately
const notLeague = /playoff|cup|friendl|preseason|pre-season|invitational|champions|exhibition|all-star|international|fall series/i

// the nwsl season runs within one calendar year, from march
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
  }
  const season = parseInfobox(doc, ['football club season', 'soccer club season'], {})
  const games = findMatches(doc, ctx, gameTitles, notLeague)
  const playoffs = findMatches(doc, ctx, ['playoffs', 'postseason'], null)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: {
      record: countRecord(games),
      league: getCell(season, ['league']) || '',
      position: getCell(season, ['position', 'league_result', 'league result']) || null,
      manager: getCell(season, ['manager', 'mgrtitle', 'head coach']) || '',
      stadium: getCell(season, ['stadium', 'stdtitle']) || '',
    },
    games,
    playoffs,
  }
}

const addMethod = function (models) {
  models.wtf.nwslSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.nwslSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
