/* eslint-disable no-console */
// live smoke-test: fetch every team-season page and check the game-log parses.
// prints games + wins per season, and flags problems:
//   NO PAGE   - the page title doesn't exist
//   NO LOG    - the page has no game-log/schedule section (a wikipedia gap)
//   EMPTY LOG - log markup exists but parsed to zero games (likely a parser gap)
//   MISMATCH  - win-count from the log disagrees with the infobox record
//
//   node scripts/smoke-test.js                → both leagues, all years
//   node scripts/smoke-test.js nhl            → one league
//   node scripts/smoke-test.js mlb 1994 1998  → a year range
//
// it fetches one page at a time, slowly - a full run takes about an hour
import wtf from '../../../src/index.ts'
import { mlb, nhl } from '../src/index.js'
import mlbFranchises from '../src/mlb/franchises.js'
import nhlFranchises from '../src/nhl/franchises.js'
import { makeTitle as mlbTitle } from '../src/mlb/index.js'
import { makeTitle as nhlTitle } from '../src/nhl/index.js'
wtf.extend(mlb)
wtf.extend(nhl)

const delayMs = 500
const firstYear = 2012 //1980
const thisYear = new Date().getFullYear()

const leagues = {
  mlb: {
    franchises: mlbFranchises,
    title: mlbTitle,
    parse: (doc) => doc.mlbSeason(),
    players: (res) => res.roster.length,
  },
  nhl: {
    franchises: nhlFranchises,
    title: nhlTitle,
    parse: (doc) => doc.nhlSeason(),
    players: (res) => res.skaters.length + res.goalies.length,
  },
}

// does the page even contain game-log markup?
const hasLog = (wiki) => /\{\{ *(?:mlb )?game log|^ *=+ *(?:game log|schedule and results|schedule)/im.test(wiki)

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// the name each franchise used in a given year - null before it existed
const teamsFor = function (franchises, year) {
  return franchises.map((names) => names.find((o) => o.from <= year)?.name).filter(Boolean)
}

const checkSeason = async function (league, team, year) {
  let doc = null
  let res = null
  try {
    doc = await wtf.fetch(leagues[league].title(team, year))
    res = doc ? leagues[league].parse(doc) : null
  } catch (e) {
    return { games: 0, wins: 0, players: 0, flag: 'ERROR', note: e.message }
  }
  if (!res) {
    return { games: 0, wins: 0, players: 0, flag: 'NO PAGE', note: '' }
  }
  const games = res.games.length
  const wins = res.games.filter((g) => g.win === true).length
  const players = leagues[league].players(res)
  const out = { games, wins, players, flag: '', note: '' }
  const recWins = res.season?.record?.wins
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

const run = async function () {
  const args = process.argv.slice(2)
  const only = args.find((a) => leagues[a] !== undefined) || null
  const years = args.filter((a) => /^\d{4}$/.test(a)).map(Number)
  const from = years[0] || firstYear
  const to = years[1] || years[0] || thisYear
  const flagged = []
  let count = 0
  for (const league of Object.keys(leagues)) {
    if (only && league !== only) {
      continue
    }
    for (let year = from; year <= to; year += 1) {
      for (const team of teamsFor(leagues[league].franchises, year)) {
        const res = await checkSeason(league, team, year)
        count += 1
        const label = `${league} ${year}  ${team}`.padEnd(44)
        const counts = `${String(res.games).padStart(3)} games  ${String(res.wins).padStart(3)} wins  ${String(res.players).padStart(3)} players`
        if (res.flag) {
          const line = `⚠ ${label}${counts}  ${res.flag}${res.note ? ' - ' + res.note : ''}`
          flagged.push(line)
          console.log(line)
        } else {
          console.log(`  ${label}${counts}`)
        }
        await sleep(delayMs)
      }
    }
  }
  console.log(`\nchecked ${count} seasons - ${flagged.length} flagged`)
  flagged.forEach((line) => console.log(line))
}
run()
