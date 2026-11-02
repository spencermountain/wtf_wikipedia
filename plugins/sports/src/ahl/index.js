import { getCell, stripNotes } from '../_lib.js'
import { findGames, findSeries } from '../engine/games.js'
import parseInfobox from '../engine/infobox.js'
import findTransactions from '../engine/transactions.js'
import { coachOf, gmOf, venueOf, seasonDates, avgAttendance } from '../engine/season.js'
import resolveTeam from '../engine/teams.js'
import { twoYearTitle, parseTwoYearTitle } from '../engine/slug.js'
import franchises from './franchises.js'
import { parseSkaters, parseGoalies, parseRoster } from '../nhl/players.js'

const makeTitle = twoYearTitle

const gameTitles = ['regular season', 'schedule and results', 'game log', 'schedule']

// ahl seasons start in october - before august, "this season" began last year
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

const standings = function (season) {
  const divisionPlace = getCell(season, ['divisionrank', 'division_place', 'divisionplace']) || null
  const conferencePlace = getCell(season, ['conferencerank', 'conference_place']) || null
  return {
    record: season.record || null,
    place: divisionPlace || conferencePlace,
    coach: coachOf(season),
    gm: gmOf(season),
    venue: venueOf(season),
    division: getCell(season, ['division']) || '',
    divisionPlace,
    conference: getCell(season, ['conference']) || '',
    conferencePlace,
    goalsFor: getCell(season, ['goalsfor', 'goals_for']) || null,
    goalsAgainst: getCell(season, ['goalsagainst', 'goals_against']) || null,
  }
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  // missing team-seasons often redirect to the league page - don't parse those.
  // some old team pages have no infobox at all, and still parse fine
  const kinds = doc.infoboxes().map((inf) => inf.type())
  if (kinds.length > 0 && kinds.includes('ice hockey team season') === false) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    // W–L–T–OTL until the 2004-05 shootout era, W–L–OTL–SOL after
    record: meta.year && meta.year < 2004 ? { ties: true } : { soLosses: true },
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
  const season = parseInfobox(doc, ['ice hockey team season'], ctx.record)
  const games = findGames(doc, ctx, gameTitles)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    ...seasonDates(games),
    attendance: avgAttendance(games, season),
    season,
    standings: standings(season),
    games,
    transactions: findTransactions(doc, ctx),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles),
    skaters: parseSkaters(doc),
    goalies: parseGoalies(doc),
    roster: parseRoster(doc),
  }
}

const addMethod = function (models) {
  models.wtf.ahlSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.ahlSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
