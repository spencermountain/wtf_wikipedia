import { getCell } from '../_lib.js'
import { findGames, findSeries } from '../engine/games.js'
import parseInfobox from '../engine/infobox.js'
import parseRecord from '../engine/record.js'
import resolveTeam from '../engine/teams.js'
import { oneYearTitle, parseOneYearTitle } from '../engine/slug.js'
import franchises from './franchises.js'
import { parseRoster } from './players.js'
import { parsePlayerStats } from '../nba/players.js'

const makeTitle = oneYearTitle

const gameTitles = ['regular season', 'game log', 'schedule', 'schedule and results']

// the wnba season runs may-october, within one calendar year
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 4 ? now.getFullYear() : now.getFullYear() - 1
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

// the wnba infobox keeps wins and losses as separate fields
const standings = function (season) {
  let record = season.record || null
  const wins = getCell(season, ['wins'])
  const losses = getCell(season, ['losses'])
  if (!record && wins !== '' && losses !== '') {
    record = parseRecord(`${wins}–${losses}`)
  }
  return {
    record,
    conference: getCell(season, ['conf', 'conference']) || '',
    conferencePlace: getCell(season, ['conf_place', 'conference_place']) || null,
    coach: getCell(season, ['coach', 'coaches']) || '',
    arena: getCell(season, ['arena']) || '',
  }
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseOneYearTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: {},
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
    extras,
  }
  const season = parseInfobox(doc, ['wnba team season'], ctx.record)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings(season),
    games: findGames(doc, ctx, gameTitles),
    playoffs: findSeries(doc, ctx, ['playoffs', 'postseason'], gameTitles),
    roster: parseRoster(doc),
    playerStats: parsePlayerStats(doc),
  }
}

const addMethod = function (models) {
  models.wtf.wnbaSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.wnbaSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
