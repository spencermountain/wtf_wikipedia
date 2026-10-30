import { getCell, stripNotes } from '../_lib.js'
import { findGames, findSeries } from '../engine/games.js'
import parseInfobox from '../engine/infobox.js'
import resolveTeam from '../engine/teams.js'
import franchises from './franchises.js'
import { parseRoster, parseDraftPicks, parsePlayerStats } from './extras.js'

// '2025 Toronto Blue Jays season' → {year: 2025, team: 'Toronto Blue Jays'}
const parseTitle = function (title = '') {
  const m = String(title).match(/^(\d{4}) (.+?) season$/)
  if (m) {
    return { year: Number(m[1]), team: m[2] }
  }
  const year = String(title).match(/\d{4}/)
  return { year: year ? Number(year[0]) : null, team: '' }
}

// before opening-day in april, "this season" usually means last year's
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1
}

const noSave = /^[–\-−—]*$/
const gameTitles = ['game log', 'season game log', 'schedule and results', 'schedule', 'regular season']

// per-game extras: the pitchers of record, and games-back
const extras = function (game, row) {
  const win = stripNotes(getCell(row.cells, ['win']))
  const loss = stripNotes(getCell(row.cells, ['loss']))
  let save = stripNotes(getCell(row.cells, ['save']))
  if (noSave.test(save)) {
    save = null
  }
  game.pitchers = { win, loss, save }
  const gb = getCell(row.cells, ['gb', 'games back'])
  if (gb) {
    game.gamesBack = gb
  }
}

const standings = function (season) {
  return {
    record: season.record || null,
    league: getCell(season, ['league']) || '',
    division: getCell(season, ['division']) || '',
    divisionPlace: getCell(season, ['divisional_place', 'division_place', 'divisionrank']) || null,
    manager: getCell(season, ['manager', 'managers']) || '',
    ballpark: getCell(season, ['ballpark', 'stadium']) || '',
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
    record: {},
    dateYear: (date, year) => (year && /\d{4}/.test(date) === false ? `${date} ${year}` : date),
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
    extras,
  }
  const season = parseInfobox(doc, ['baseball team season', 'mlb yearly'], ctx.record)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings(season),
    games: findGames(doc, ctx, gameTitles),
    postseason: findSeries(doc, ctx, ['postseason game log', 'postseason', 'playoffs'], gameTitles),
    roster: parseRoster(doc, meta.year),
    draftPicks: parseDraftPicks(doc),
    playerStats: parsePlayerStats(doc),
  }
}

const makeTitle = function (team, year) {
  return `${year} ${team} season`.replace(/ /g, '_')
}

const addMethod = function (models) {
  models.wtf.mlbSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.mlbSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
