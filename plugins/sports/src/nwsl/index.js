import { getCell } from '../_lib.js'
import { findMatches, findCompetitions } from '../engine/matches.js'
import parseInfobox from '../engine/infobox.js'
import findTransactions from '../engine/transactions.js'
import { countRecord } from '../engine/record.js'
import { coachOf, gmOf, venueOf, placeOf, seasonDates, avgAttendance } from '../engine/season.js'
import resolveTeam from '../engine/teams.js'
import { oneYearTitle, parseOneYearTitle } from '../engine/slug.js'
import franchises from './franchises.js'
import parseSquad from '../epl/players.js'

const makeTitle = oneYearTitle

const gameTitles = ['regular season', 'match results', 'matches', 'results']

// league matches only - cups, friendlies and the playoffs parse separately
const notLeague = /playoff|cup|friendl|preseason|pre-season|invitational|champions|exhibition|all-star|international|fall series/i

// each cup run keeps its own list - the playoffs stay under `playoffs`
const cupish = /\bcup\b|champions/i
const notCup = /play-?off|postseason|friendl|pre-?season|invitational|exhibition|all-star|international/i

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
  const position = getCell(season, ['position', 'league_result', 'league result']) || null
  const squad = parseSquad(doc)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    ...seasonDates(games),
    attendance: avgAttendance(games, season),
    season,
    standings: {
      record: countRecord(games),
      place: placeOf(position),
      coach: coachOf(season),
      gm: gmOf(season),
      venue: venueOf(season),
      league: getCell(season, ['league']) || '',
      position,
      manager: getCell(season, ['manager', 'mgrtitle', 'head coach']) || '',
      stadium: getCell(season, ['stadium', 'stdtitle']) || '',
    },
    games,
    transactions: findTransactions(doc, ctx),
    playoffs,
    cups: findCompetitions(doc, ctx, cupish, notCup),
    roster: squad,
    squad,
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
