import { readFileSync } from 'node:fs'
import test from 'tape'
import wtf from './_lib.js'

const fixture = (file, title) => {
  const str = readFileSync(new URL(`fixtures/${file}`, import.meta.url), 'utf8')
  return wtf(str, { title })
}

const tally = (games) =>
  games.reduce((h, g) => {
    h[g.outcome] = (h[g.outcome] || 0) + 1
    return h
  }, {})

test('2024-25 maple leafs: nested month-tables + game-won templates', (t) => {
  const res = fixture('2024-25-toronto-maple-leafs.txt', '2024–25 Toronto Maple Leafs season').nhlSeason()
  t.equal(res.team, 'Toronto Maple Leafs', 'team')
  t.equal(res.year, 2024, 'year')
  t.equal(res.games.length, 82, 'all 82 games')
  t.deepEqual(tally(res.games), { win: 52, loss: 26, otl: 4 }, 'outcomes match the 52–26–4 record')

  const g1 = res.games[0]
  t.equal(g1.opponent, 'Montreal Canadiens', 'opponent from season-page link')
  t.equal(g1.home, false, 'road game from visitor/home columns')
  t.deepEqual(g1.result, { us: 0, them: 1 }, 'visitor-home score oriented')
  t.equal(g1.decision, 'Stolarz', 'goalie of record')
  t.equal(g1.attendance, 21105, 'attendance')

  const otl = res.games[8]
  t.equal(otl.outcome, 'otl', 'game-otl row template')
  t.equal(otl.overtime, true, 'ot flag')
  t.deepEqual(otl.result, { us: 3, them: 4 }, 'otl score')

  t.equal(res.playoffs.length, 2, 'two playoff series')
  t.equal(res.playoffs[0].length, 6, 'first round went six games')
  t.equal(res.playoffs[0][0].opponent, 'Ottawa Senators', 'playoff opponent resolved to full name')

  t.equal(res.skaters.length, 32, 'skaters')
  t.equal(res.goalies.length, 4, 'goalies')
  t.equal(res.goalies[0].savePct, 0.909, 'goalie save pct')

  t.deepEqual(res.season.record, { wins: 52, losses: 26, otLosses: 4, games: 82, winPct: 0.634 }, 'infobox record')
  t.equal(res.standings.divisionPlace, 1, 'camelcase DivisionRank key')
  t.equal(res.standings.division, 'Atlantic', 'division name')
  t.end()
})

test('2025 blue jays: game-log templates + postseason', (t) => {
  const res = fixture('2025-toronto-blue-jays.txt', '2025 Toronto Blue Jays season').mlbSeason()
  t.equal(res.team, 'Toronto Blue Jays', 'team')
  t.deepEqual(tally(res.games), { win: 94, loss: 68, postponed: 2 }, 'outcomes match the 94–68 record')

  const g1 = res.games[0]
  t.equal(g1.opponent, 'Baltimore Orioles', 'opponent from season-page link')
  t.equal(g1.home, true, 'home game')
  t.deepEqual(g1.result, { us: 2, them: 12 }, 'ours-first score kept for a loss')
  t.deepEqual(g1.pitchers, { win: 'Eflin', loss: 'Berríos', save: null }, 'pitchers of record')
  t.equal(g1.gamesBack, '1', 'games back')

  const postponed = res.games.find((g) => g.outcome === 'postponed')
  t.ok(postponed, 'postponed game kept')
  t.equal(postponed.win, null, 'postponed game is not a loss')

  t.equal(res.postseason.length, 3, 'three postseason series')
  const ws = res.postseason.at(-1)
  t.equal(ws.length, 7, 'world series went seven')
  t.equal(ws.at(-1).opponent, 'Los Angeles Dodgers', 'ws opponent')
  t.deepEqual(ws.at(-1).result, { us: 4, them: 5 }, 'extra-innings score parsed through {{small}}')

  t.equal(res.roster.length, 72, 'mlbplayer roster templates')
  t.equal(res.playerStats.batters.length, 25, 'batting table')
  t.equal(res.playerStats.pitchers.length, 41, 'pitching table')

  t.deepEqual(res.season.record, { wins: 94, losses: 68, games: 162, winPct: 0.58 }, 'winpct infobox record')
  t.equal(res.standings.divisionPlace, 1, 'division place')
  t.equal(res.standings.ballpark, 'Rogers Centre', 'ballpark')
  t.end()
})

test('2002-03 maple leafs: four-part records + ties era', (t) => {
  const res = fixture('2002-03-toronto-maple-leafs.txt', '2002–03 Toronto Maple Leafs season').nhlSeason()
  t.equal(res.games.length, 82, 'all 82 games')
  t.deepEqual(tally(res.games), { win: 44, loss: 28, tie: 7, otl: 3 }, 'outcomes match the 44–28–7–3 record')

  const g1 = res.games[0]
  t.equal(g1.opponent, 'Pittsburgh Penguins', 'opponent from plain team link')
  t.equal(g1.home, false, 'away game')
  t.deepEqual(g1.result, { us: 6, them: 0 }, 'score')
  t.deepEqual(
    g1.record,
    { wins: 1, losses: 0, ties: 0, otLosses: 0, games: 1, winPct: 1 },
    'four-part running record'
  )

  const tie = res.games.find((g) => g.outcome === 'tie')
  t.ok(tie.overtime, 'ties ended in overtime')
  t.equal(tie.result.us, tie.result.them, 'tied score')

  t.deepEqual(
    res.season.record,
    { wins: 44, losses: 28, ties: 7, otLosses: 3, games: 82, winPct: 0.537 },
    'infobox record'
  )
  t.equal(res.playoffs.length, 1, 'one playoff series')
  t.equal(res.skaters.length, 36, 'skaters')
  t.equal(res.goalies.length, 3, 'goalies')
  t.end()
})
