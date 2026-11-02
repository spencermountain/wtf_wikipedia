import { getCell } from '../_lib.js'
import { findMatches, findCompetitions } from '../engine/matches.js'
import { findGames } from '../engine/games.js'
import parseInfobox from '../engine/infobox.js'
import { countRecord } from '../engine/record.js'
import resolveTeam from '../engine/teams.js'
import { twoYearTitle, parseTwoYearTitle } from '../engine/slug.js'
import franchises from './franchises.js'
import parseSquad from './players.js'

const makeTitle = twoYearTitle

// the league phase hides under different names across three decades
const gameTitles = ['premier league', 'fa premier league', 'matches', 'results', 'league']

// league matches only - cups, friendlies and europe parse separately
const notLeague =
  /\bcup\b|friendl|preseason|pre-season|champions league|europa|uefa|shield|trophy|testimonial|exhibition|abandoned|play-?off|asia|anglo-italian/i

// one club season spans several competitions - each cup run keeps its own list
const cupish = /\bcup\b|shield|champions league|europa|uefa|trophy|play-?offs\b/i
const friendly = /friendl|pre-?season|testimonial|emirates cup|asia trophy/i

// the english season runs august to may
const defaultYear = function () {
  const now = new Date()
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
}

const parse = function (doc) {
  if (!doc) {
    return null
  }
  // missing season-titles redirect to the club page - don't parse those
  const kinds = doc.infoboxes().map((inf) => inf.type())
  if (kinds.length > 0 && kinds.includes('football club season') === false) {
    return null
  }
  const meta = parseTwoYearTitle(doc.title || '')
  const ctx = {
    team: meta.team,
    year: meta.year,
    draws: true, //yellow rows are draws here, not overtime losses
    dateYear: (date, year) => {
      if (!year || /\d{4}/.test(date)) {
        return date
      }
      // the season wraps into the next calendar-year
      return /\b(jan|feb|mar|apr|may|jun)/i.test(date) ? `${date} ${year + 1}` : `${date} ${year}`
    },
    fullName: (name) => resolveTeam(franchises, name, meta.year || new Date().getFullYear()),
  }
  const season = parseInfobox(doc, ['football club season', 'soccer club season'], {})
  // modern pages box every match - early-90s pages table them instead
  let games = findMatches(doc, ctx, gameTitles, notLeague)
  if (games.length === 0) {
    games = findGames(doc, ctx, gameTitles)
  }
  const rec = countRecord(games)
  return {
    team: meta.team,
    year: meta.year,
    page: doc.title || '',
    season,
    standings: {
      record: rec,
      points: rec.wins * 3 + rec.ties, //three points for a win, since 1981
      league: getCell(season, ['league']) || '',
      position: getCell(season, ['position', 'league_result', 'league result']) || null,
      manager: getCell(season, ['manager', 'mgrtitle', 'head coach']) || '',
      stadium: getCell(season, ['stadium', 'stdtitle']) || '',
    },
    games,
    cups: findCompetitions(doc, ctx, cupish, friendly),
    squad: parseSquad(doc),
  }
}

const addMethod = function (models) {
  models.wtf.eplSeason = async function (team, year, options) {
    year ||= defaultYear()
    team = resolveTeam(franchises, team, year)
    const doc = await models.wtf.fetch(makeTitle(team, year), options)
    return parse(doc)
  }
  models.Doc.prototype.eplSeason = function () {
    return parse(this)
  }
}
export default addMethod
export { makeTitle }
