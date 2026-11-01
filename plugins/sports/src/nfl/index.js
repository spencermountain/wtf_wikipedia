import { getCell } from '../_lib.js'
import { findGames, findSeries } from '../engine/games.js'
import parseInfobox from '../engine/infobox.js'
import resolveTeam from '../engine/teams.js'
import franchises from './franchises.js'

// '2024 Buffalo Bills season' → {year: 2024, team: 'Buffalo Bills'}
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

const gameTitles = ['regular season', 'schedule', 'game log', 'schedule and results']

// nfl seasons are named by their september start - before august, use last year's
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
}

// per-game extras: the stadium
const extras = function (game, row) {
  const venue = getCell(row.cells, ['venue', 'game site', 'stadium', 'location'])
  if (venue) {
    game.venue = venue
  }
}

// '1st AFC East' → {divisionPlace: 1, division: 'AFC East'}
const standings = function (season) {
  const out = {
    record: season.record || null,
    division: '',
    divisionPlace: null,
    coach: getCell(season, ['coach', 'coaches']) || '',
    stadium: getCell(season, ['stadium']) || '',
  }
  const place = String(getCell(season, ['division_place', 'division place']) || '')
  const m = place.match(/^(\d+)(?:st|nd|rd|th)\b *(.*)/)
  if (m) {
    out.divisionPlace = Number(m[1])
    out.division = m[2].trim()
  } else if (place) {
    out.division = place
  }
  return out
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  const meta = parseTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    record: { ties: true }, //nfl records are W–L–T
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // playoff games run into january
      return /^(jan|feb)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
    extras,
  }
  const season = parseInfobox(doc, ['nfl team season', 'nfl season'], ctx.record)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: standings(season),
    games: findGames(doc, ctx, gameTitles),
    // nfl playoffs are single games, not series - keep them flat
    playoffs: findSeries(doc, ctx, ['postseason schedule', 'postseason', 'playoffs'], gameTitles).flat(),
  }
}

const addMethod = function (models) {
  models.wtf.nflSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.nflSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
