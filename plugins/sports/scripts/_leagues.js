// shared league table + season-checker for the live scripts (smoke-test, write-db)
import wtf from '../../../src/index.ts'
import { mlb, nhl, nba, nfl, mls, wnba, nwsl, pwhl, cfl } from '../src/index.js'
import mlbFranchises from '../src/mlb/franchises.js'
import nhlFranchises from '../src/nhl/franchises.js'
import nbaFranchises from '../src/nba/franchises.js'
import nflFranchises from '../src/nfl/franchises.js'
import mlsFranchises from '../src/mls/franchises.js'
import wnbaFranchises from '../src/wnba/franchises.js'
import nwslFranchises from '../src/nwsl/franchises.js'
import pwhlFranchises from '../src/pwhl/franchises.js'
import cflFranchises from '../src/cfl/franchises.js'
import { makeTitle as mlbTitle } from '../src/mlb/index.js'
import { makeTitle as nhlTitle } from '../src/nhl/index.js'
import { makeTitle as nbaTitle } from '../src/nba/index.js'
import { makeTitle as nflTitle } from '../src/nfl/index.js'
import { makeTitle as mlsTitle } from '../src/mls/index.js'
import { makeTitle as wnbaTitle } from '../src/wnba/index.js'
import { makeTitle as nwslTitle } from '../src/nwsl/index.js'
import { makeTitle as pwhlTitle } from '../src/pwhl/index.js'
import { makeTitle as cflTitle } from '../src/cfl/index.js'
wtf.extend(mlb)
wtf.extend(nhl)
wtf.extend(nba)
wtf.extend(nfl)
wtf.extend(mls)
wtf.extend(wnba)
wtf.extend(nwsl)
wtf.extend(pwhl)
wtf.extend(cfl)

// `from` is the earliest season the sweep bothers with
const leagues = {
  mlb: {
    from: 1980,
    franchises: mlbFranchises,
    title: mlbTitle,
    parse: (doc) => doc.mlbSeason(),
    players: (res) => res.roster.length,
  },
  nhl: {
    from: 1980,
    franchises: nhlFranchises,
    title: nhlTitle,
    parse: (doc) => doc.nhlSeason(),
    players: (res) => res.skaters.length + res.goalies.length,
  },
  nba: {
    from: 1980,
    franchises: nbaFranchises,
    title: nbaTitle,
    parse: (doc) => doc.nbaSeason(),
    players: (res) => res.roster.length,
  },
  nfl: {
    from: 1980,
    franchises: nflFranchises,
    title: nflTitle,
    parse: (doc) => doc.nflSeason(),
    players: () => 0, //nfl rosters are transcluded from separate template pages
  },
  mls: {
    from: 1996,
    franchises: mlsFranchises,
    title: mlsTitle,
    parse: (doc) => doc.mlsSeason(),
    players: () => 0, //mls squads use their own template system
  },
  wnba: {
    from: 1997,
    franchises: wnbaFranchises,
    title: wnbaTitle,
    parse: (doc) => doc.wnbaSeason(),
    players: (res) => res.roster.length,
  },
  nwsl: {
    from: 2013,
    franchises: nwslFranchises,
    title: nwslTitle,
    parse: (doc) => doc.nwslSeason(),
    players: () => 0, //nwsl squads are plain tables
  },
  pwhl: {
    from: 2023,
    franchises: pwhlFranchises,
    title: pwhlTitle,
    parse: (doc) => doc.pwhlSeason(),
    players: (res) => res.skaters.length + res.goalies.length,
  },
  cfl: {
    from: 1980,
    franchises: cflFranchises,
    title: cflTitle,
    parse: (doc) => doc.cflSeason(),
    players: (res) => res.roster.length,
  },
}

// does the page even contain game-log or match markup?
const hasLog = (wiki) =>
  /\{\{ *(?:mlb |nba |wnba )?game log|\{\{ *football ?box|\{\{ *nfl .*schedule start|^ *=+ *(?:game log|schedule and results|schedule)/im.test(
    wiki
  )

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// the name each franchise used in a given year - none before it existed, or after it folded
const teamsFor = function (franchises, year) {
  return franchises
    .map((names) => names.find((o) => o.from <= year && (o.to === undefined || year <= o.to))?.name)
    .filter(Boolean)
}

// fetch one team-season and sanity-check the parse:
//   NO PAGE   - the page title doesn't exist
//   NO LOG    - the page has no game-log/schedule section (a wikipedia gap)
//   EMPTY LOG - log markup exists but parsed to zero games (likely a parser gap)
//   MISMATCH  - win-count from the log disagrees with the infobox record
const checkSeason = async function (league, team, year) {
  let doc = null
  let res = null
  try {
    doc = await wtf.fetch(leagues[league].title(team, year))
    res = doc ? leagues[league].parse(doc) : null
  } catch (e) {
    return { games: 0, wins: 0, players: 0, flag: 'ERROR', note: e.message, res: null }
  }
  if (!res) {
    return { games: 0, wins: 0, players: 0, flag: 'NO PAGE', note: '', res: null }
  }
  const games = res.games.length
  const wins = res.games.filter((g) => g.win === true).length
  const players = leagues[league].players(res)
  const out = { games, wins, players, flag: '', note: '', res }
  // the infobox record, or the one standings derives from separate win/loss fields
  const recWins = res.season?.record?.wins ?? res.standings?.record?.wins
  if (games === 0) {
    if (hasLog(doc.wikitext())) {
      out.flag = 'EMPTY LOG'
      out.note = 'log markup exists but parsed to zero'
    } else {
      out.flag = 'NO LOG'
      out.note = 'page has no game-log section'
    }
  } else if (recWins !== undefined && wins !== recWins) {
    out.flag = 'MISMATCH'
    out.note = `game-log has ${wins}W, infobox says ${recWins}W`
  }
  return out
}

export { leagues, teamsFor, checkSeason, sleep }
