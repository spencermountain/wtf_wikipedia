/* eslint-disable no-console */
// live smoke-test: fetch every team-season page and check the game-log parses.
// prints games + wins per season, and flags missing pages, empty logs,
// and win-counts that disagree with the infobox record.
//
//   node scripts/smoke-test.js                → both leagues, 1980-now
//   node scripts/smoke-test.js nhl            → one league
//   node scripts/smoke-test.js mlb 1994 1998  → a year range
//
// it fetches one page at a time, slowly - a full run takes about an hour
import wtf from '../../../src/index.ts'
import { mlb, nhl } from '../src/index.js'
import mlbFranchises from '../src/mlb/franchises.js'
import nhlFranchises from '../src/nhl/franchises.js'
wtf.extend(mlb)
wtf.extend(nhl)

const delayMs = 500
const firstYear = 1980
const thisYear = new Date().getFullYear()

const leagues = {
  mlb: { franchises: mlbFranchises, fetch: (team, year) => wtf.mlbSeason(team, year) },
  nhl: { franchises: nhlFranchises, fetch: (team, year) => wtf.nhlSeason(team, year) },
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

// the name each franchise used in a given year - null before it existed
const teamsFor = function (franchises, year) {
  return franchises.map((names) => names.find((o) => o.from <= year)?.name).filter(Boolean)
}

const checkSeason = async function (league, team, year) {
  let res = null
  try {
    res = await leagues[league].fetch(team, year)
  } catch (e) {
    return { games: 0, wins: 0, flag: 'ERROR', note: e.message }
  }
  if (!res) {
    return { games: 0, wins: 0, flag: 'NO PAGE', note: '' }
  }
  const games = res.games.length
  const wins = res.games.filter((g) => g.win === true).length
  const out = { games, wins, flag: '', note: '' }
  const recWins = res.season?.record?.wins
  if (games === 0) {
    out.flag = 'NO GAMES'
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
        const counts = `${String(res.games).padStart(3)} games  ${String(res.wins).padStart(3)} wins`
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
