import { getCell } from '../_lib.js'
import { findGames, findSeries } from '../engine/games.js'
import findQuarterGames from '../engine/quarters.js'
import parseInfobox from '../engine/infobox.js'
import { coachOf, gmOf, venueOf, seasonDates, avgAttendance } from '../engine/season.js'
import resolveTeam from '../engine/teams.js'
import { oneYearTitle, parseOneYearTitle } from '../engine/slug.js'
import franchises from './franchises.js'
import { parseRoster } from './players.js'

const makeTitle = oneYearTitle

const gameTitles = ['regular season', 'season schedule', 'schedule', 'game log']

// the cfl season runs june-november, within one calendar year
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1
}

// per-game extras: the stadium
const extras = function (game, row) {
  const venue = getCell(row.cells, ['venue', 'game site', 'stadium', 'location'])
  if (venue) {
    game.venue = venue
  }
}

// '2nd, East' → {divisionPlace: 2, division: 'East'}
const standings = function (season) {
  const out = {
    record: season.record || null,
    place: null,
    coach: coachOf(season),
    gm: gmOf(season),
    venue: venueOf(season),
    division: '',
    divisionPlace: null,
    stadium: getCell(season, ['stadium']) || '',
  }
  const place = String(getCell(season, ['division_place', 'division place']) || '')
  const m = place.match(/^(\d+)(?:st|nd|rd|th)\b[, ]*(.*)/)
  if (m) {
    out.divisionPlace = Number(m[1])
    out.place = out.divisionPlace
    out.division = m[2].trim()
  } else if (place) {
    out.division = place
  }
  return out
}

const playoffTitles = ['post-season', 'postseason', 'playoffs']

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: { ties: true }, //cfl records are W–L–T
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
    extras,
  }
  const season = parseInfobox(doc, ['nfl team season', 'nfl season'], ctx.record)
  // cfl playoffs are single games, not series - keep them flat,
  // falling back to the older two-row quarter-score boxes
  let playoffs = findSeries(doc, ctx, playoffTitles, gameTitles).flat()
  if (playoffs.length === 0) {
    playoffs = findQuarterGames(doc, ctx, playoffTitles)
  }
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
    playoffs,
    roster: parseRoster(doc),
  }
}

const addMethod = function (models) {
  models.wtf.cflSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.cflSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
