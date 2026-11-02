/* eslint-disable no-console */
// live db-writer: fetch every team-season page and keep the parsed results
// in a duckdb file (./sports.duckdb), for ad-hoc queries - see scratch.js
//
//   pnpm run write:nhl              → one league, from its first season
//   pnpm run write:nhl -- 1994 1998 → a year range
//   pnpm run write:all              → every league - a full run takes hours
//   pnpm run write:dump             → delete the file and start over
//
// seasons already in the file are skipped, so an interrupted run resumes
import { rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { DuckDBInstance } from '@duckdb/node-api'
import { leagues, teamsFor, checkSeason, sleep } from './_leagues.js'

const dbPath = fileURLToPath(new URL('../sports.duckdb', import.meta.url))
const delayMs = 500
const thisYear = new Date().getFullYear()

const seasonsTable = `CREATE TABLE IF NOT EXISTS seasons (
  league VARCHAR, year INTEGER, team VARCHAR, page VARCHAR,
  games INTEGER, wins INTEGER, losses INTEGER, ties INTEGER, ot_losses INTEGER,
  playoff_games INTEGER, players INTEGER, record_wins INTEGER,
  flag VARCHAR, note VARCHAR, fetched_at TIMESTAMP DEFAULT now()
)`
const gamesTable = `CREATE TABLE IF NOT EXISTS games (
  league VARCHAR, year INTEGER, team VARCHAR, game INTEGER, date VARCHAR,
  opponent VARCHAR, home BOOLEAN, outcome VARCHAR, win BOOLEAN,
  us INTEGER, them INTEGER, overtime BOOLEAN, attendance INTEGER, playoffs BOOLEAN
)`

// mlb says 'postseason', nfl/mls/nwsl/cfl keep theirs flat, the rest are arrays per series.
// epl keeps its cup runs in an object - those are its non-league games here
const playoffGames = function (res) {
  if (res.cups) {
    return Object.values(res.cups).flat()
  }
  const po = res.playoffs ?? res.postseason ?? []
  return Array.isArray(po[0]) ? po.flat() : po
}

const insertGame = async function (conn, key, g, isPlayoff) {
  await conn.run(
    `INSERT INTO games VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      ...key,
      g.game ?? null,
      g.date || '',
      g.opponent || '',
      g.home ?? null,
      g.outcome ?? null,
      g.win ?? null,
      g.result?.us ?? null,
      g.result?.them ?? null,
      g.overtime === true,
      g.attendance ?? null,
      isPlayoff,
    ]
  )
}

const insertSeason = async function (conn, key, check) {
  const { res } = check
  const outcomes = { win: 0, loss: 0, tie: 0, otl: 0 }
  const games = res?.games || []
  games.forEach((g) => {
    if (outcomes[g.outcome] !== undefined) {
      outcomes[g.outcome] += 1
    }
  })
  const playoffs = res ? playoffGames(res) : []
  const recWins = res?.season?.record?.wins ?? res?.standings?.record?.wins ?? null
  await conn.run(`INSERT INTO seasons VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,now())`, [
    ...key,
    res?.page || '',
    games.length,
    outcomes.win,
    outcomes.loss,
    outcomes.tie,
    outcomes.otl,
    playoffs.length,
    check.players,
    recWins,
    check.flag,
    check.note,
  ])
  for (const g of games) {
    await insertGame(conn, key, g, false)
  }
  for (const g of playoffs) {
    await insertGame(conn, key, g, true)
  }
}

const run = async function () {
  const args = process.argv.slice(2)
  if (args[0] === 'dump') {
    rmSync(dbPath, { force: true })
    rmSync(dbPath + '.wal', { force: true })
    console.log('cleared', dbPath)
    return
  }
  const all = args.includes('all')
  const only = args.find((a) => leagues[a] !== undefined) || null
  if (!all && !only) {
    console.log('usage: node scripts/write-db.js [all|dump|' + Object.keys(leagues).join('|') + '] [from] [to]')
    return
  }
  const years = args.filter((a) => /^\d{4}$/.test(a)).map(Number)
  const db = await DuckDBInstance.create(dbPath)
  const conn = await db.connect()
  await conn.run(seasonsTable)
  await conn.run(gamesTable)
  // skip seasons already written, so interrupted runs resume
  const reader = await conn.runAndReadAll('SELECT league, year, team FROM seasons')
  const have = new Set(reader.getRowObjects().map((r) => `${r.league}|${r.year}|${r.team}`))
  let wrote = 0
  let skipped = 0
  const flagged = []
  for (const league of Object.keys(leagues)) {
    if (only && league !== only) {
      continue
    }
    const from = years[0] || leagues[league].from
    const to = years[1] || years[0] || thisYear
    for (let year = from; year <= to; year += 1) {
      for (const team of teamsFor(leagues[league].franchises, year)) {
        if (have.has(`${league}|${year}|${team}`)) {
          skipped += 1
          continue
        }
        const check = await checkSeason(league, team, year)
        await insertSeason(conn, [league, year, team], check)
        wrote += 1
        const label = `${league} ${year}  ${team}`.padEnd(44)
        if (check.flag) {
          flagged.push(label.trim() + '  ' + check.flag)
          console.log(`⚠ ${label}${check.games} games  ${check.flag}${check.note ? ' - ' + check.note : ''}`)
        } else {
          console.log(`  ${label}${check.games} games  ${check.wins} wins`)
        }
        await sleep(delayMs)
      }
    }
  }
  conn.closeSync()
  db.closeSync()
  console.log(`\nwrote ${wrote} seasons (${skipped} already there) - ${flagged.length} flagged → ${dbPath}`)
}
run()
