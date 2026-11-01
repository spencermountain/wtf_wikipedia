import { getCell } from '../_lib.js'
import { findMatches } from '../engine/matches.js'
import parseInfobox from '../engine/infobox.js'
import resolveTeam from '../engine/teams.js'
import franchises from './franchises.js'

// '2024 LA Galaxy season' → {year: 2024, team: 'LA Galaxy'}
const parseTitle = function (title = '') {
  const m = String(title).match(/^(\d{4}) (.+?) season$/)
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/)
  return { year: year ? Number(year[0]) : null, team: '' }
}

const makeTitle = function (team, year) {
  return `${year} ${team} season`.replace(/ /g, '_')
}

const gameTitles = ['regular season', 'match results', 'matches', 'major league soccer', 'results']

// league matches only - cups, friendlies and the playoffs parse separately
const notLeague = /playoff|cup|friendl|preseason|pre-season|invitational|champions|exhibition|all-star/i

// the mls season runs within one calendar year, from late february
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1
}

// count the record from the matches themselves - soccer infoboxes rarely state one
const recordOf = function (games) {
  const rec = { wins: 0, losses: 0, ties: 0, games: games.length }
  games.forEach((g) => {
    if (g.outcome === 'win') {
      rec.wins += 1
    } else if (g.outcome === 'loss') {
      rec.losses += 1
    } else if (g.outcome === 'tie') {
      rec.ties += 1
    }
  })
  rec.winPct = rec.games > 0 ? Number((rec.wins / rec.games).toFixed(3)) : 0
  return rec
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
  }
  const season = parseInfobox(doc, ['soccer club season', 'football club season'], {})
  const games = findMatches(doc, ctx, gameTitles, notLeague)
  const playoffs = findMatches(doc, ctx, ['mls cup playoffs', 'playoffs', 'postseason'], null)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: {
      record: recordOf(games),
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
  models.wtf.mlsSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.mlsSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
