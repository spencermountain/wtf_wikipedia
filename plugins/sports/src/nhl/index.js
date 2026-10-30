import { getCell, stripNotes } from '../_lib.js'
import { findGames, findSeries } from '../engine/games.js'
import parseInfobox from '../engine/infobox.js'
import resolveTeam from '../engine/teams.js'
import franchises from './franchises.js'
import { parseSkaters, parseGoalies } from './players.js'

// '2024–25 Toronto Maple Leafs season' → {year: 2024, team: 'Toronto Maple Leafs'}
const parseTitle = function (title = '') {
  const m = String(title).match(/^(\d{4})(?:[–-]\d{2,4})? (.+?) season$/)
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/)
  return { year: year ? Number(year[0]) : null, team: '' }
}

// nhl seasons span two years: '2024–25', with '1999–2000' at the century
const seasonSlug = function (year) {
  const next = year + 1
  let suffix = String(next % 100).padStart(2, '0')
  if (suffix === '00') {
    suffix = String(next)
  }
  return `${year}–${suffix}`
}

const makeTitle = function (team, year) {
  return `${seasonSlug(year)} ${team} season`.replace(/ /g, '_')
}

const gameTitles = ['regular season', 'schedule and results', 'game log', 'schedule']

// nhl seasons start in october - before august, "this season" began last year
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
}

// per-game extras: cumulative points, and the goalie of record
const extras = function (game, row) {
  const pts = parseInt(getCell(row.cells, ['pts', 'points']), 10)
  if (isNaN(pts) === false) {
    game.points = pts
  }
  const goalie = stripNotes(getCell(row.cells, ['decision', 'goalie']))
  if (goalie) {
    game.decision = goalie
  }
}

// absorb infobox key drift: 'division_place' is now 'DivisionRank'
const standings = function (season) {
  return {
    record: season.record || null,
    division: getCell(season, ['division']) || '',
    divisionPlace: getCell(season, ['divisionrank', 'division_place', 'divisionplace']) || null,
    conference: getCell(season, ['conference']) || '',
    conferencePlace: getCell(season, ['conferencerank', 'conference_place']) || null,
    goalsFor: getCell(season, ['goalsfor', 'goals_for']) || null,
    goalsAgainst: getCell(season, ['goalsagainst', 'goals_against']) || null,
  }
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: { ties: Boolean(meta.year && meta.year < 2005) }, //third number is OTL from 2005-06 on
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // the season wraps into the next calendar-year
      return /^(jan|feb|mar|apr|may|jun)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
    extras,
  }
  const season = parseInfobox(doc, ['ice hockey team season', 'nhl team season'], ctx.record)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings(season),
    games: findGames(doc, ctx, gameTitles),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles),
    skaters: parseSkaters(doc),
    goalies: parseGoalies(doc),
  }
}

const addMethod = function (models) {
  models.wtf.nhlSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.nhlSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { seasonSlug, makeTitle }
