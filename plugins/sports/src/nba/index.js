import { getCell } from '../_lib.js'
import { findGames, findSeries } from '../engine/games.js'
import parseInfobox from '../engine/infobox.js'
import findTransactions from '../engine/transactions.js'
import parseRecord from '../engine/record.js'
import { coachOf, gmOf, venueOf, seasonDates, avgAttendance } from '../engine/season.js'
import resolveTeam from '../engine/teams.js'
import { twoYearTitle, parseTwoYearTitle } from '../engine/slug.js'
import franchises from './franchises.js'
import { parseRoster, parsePlayerStats } from './players.js'

const makeTitle = twoYearTitle

const gameTitles = ['regular season', 'game log', 'schedule', 'schedule and results']

// nba seasons start in october - before august, "this season" began last year
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
}

// per-game extras: statistical leaders, and the arena
const extras = function (game, row) {
  const points = getCell(row.cells, ['high points'])
  const rebounds = getCell(row.cells, ['high rebounds'])
  const assists = getCell(row.cells, ['high assists'])
  if (points || rebounds || assists) {
    game.leaders = { points, rebounds, assists }
  }
  const loc = getCell(row.cells, ['location attendance', 'location', 'arena'])
  if (loc) {
    game.location = loc.replace(/[0-9][0-9,]* *$/, '').trim()
  }
}

// the nba infobox keeps wins and losses as separate fields
const standings = function (season) {
  let record = season.record || null
  const wins = getCell(season, ['wins'])
  const losses = getCell(season, ['losses'])
  if (!record && wins !== '' && losses !== '') {
    record = parseRecord(`${wins}–${losses}`)
  }
  const divisionPlace = getCell(season, ['division_place', 'divisionrank']) || null
  const conferencePlace = getCell(season, ['conf_place', 'conference_place']) || null
  return {
    record,
    place: divisionPlace || conferencePlace,
    coach: coachOf(season),
    gm: gmOf(season),
    venue: venueOf(season),
    division: getCell(season, ['division']) || '',
    divisionPlace,
    conference: getCell(season, ['conference']) || '',
    conferencePlace,
    arena: getCell(season, ['arena']) || '',
  }
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: {},
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
  const season = parseInfobox(doc, ['nba season'], ctx.record)
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
    roster: parseRoster(doc),
    playerStats: parsePlayerStats(doc),
  }
}

const addMethod = function (models) {
  models.wtf.nbaSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.nbaSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
