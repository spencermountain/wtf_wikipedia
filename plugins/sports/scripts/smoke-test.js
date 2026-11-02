/* eslint-disable no-console */
// live smoke-test: fetch every team-season page and check the game-log parses.
// prints games + wins per season, and flags problems:
//   NO PAGE   - the page title doesn't exist
//   NO LOG    - the page has no game-log/schedule section (a wikipedia gap)
//   EMPTY LOG - log markup exists but parsed to zero games (likely a parser gap)
//   MISMATCH  - win-count from the log disagrees with the infobox record
//
//   node scripts/smoke-test.js                → every league, all years
//   node scripts/smoke-test.js nhl            → one league
//   node scripts/smoke-test.js mlb 1994 1998  → a year range
//
// it fetches one page at a time, slowly - a full run takes about an hour
import { leagues, teamsFor, checkSeason, sleep } from './_leagues.js'

const delayMs = 500
const firstYear = 2012 //1980
const thisYear = new Date().getFullYear()

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
