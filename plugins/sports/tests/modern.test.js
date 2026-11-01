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

test('2024-25 raptors: nba game templates + preseason excluded', (t) => {
  const res = fixture('2024-25-toronto-raptors.txt', '2024–25 Toronto Raptors season').nbaSeason()
  t.equal(res.team, 'Toronto Raptors', 'team')
  t.equal(res.year, 2024, 'year')
  t.equal(res.games.length, 82, 'preseason games excluded')
  t.deepEqual(tally(res.games), { win: 30, loss: 52 }, 'outcomes match the 30–52 record')

  const g1 = res.games[0]
  t.equal(g1.opponent, 'Cleveland Cavaliers', 'opponent from season-page link')
  t.equal(g1.home, true, 'home game')
  t.deepEqual(g1.result, { us: 106, them: 136 }, 'score from the {{NBA game}} template')
  t.equal(g1.attendance, 19800, 'attendance after location')
  t.equal(g1.location, 'Scotiabank Arena', 'arena')
  t.equal(g1.leaders.points, 'Chris Boucher (18)', 'high-points leader')

  t.equal(res.playoffs.length, 0, 'missed the playoffs')
  t.equal(res.roster.length, 17, 'player2 roster templates')
  t.ok(res.playerStats.season.length > 15, 'player statistics table')
  t.deepEqual(res.standings.record, { wins: 30, losses: 52, games: 82, winPct: 0.366 }, 'record from wins/losses fields')
  t.equal(res.standings.divisionPlace, 3, 'division place')
  t.end()
})

test('1995-96 bulls: nba game br templates + playoffs', (t) => {
  const res = fixture('1995-96-chicago-bulls.txt', '1995–96 Chicago Bulls season').nbaSeason()
  t.equal(res.games.length, 82, 'all 82 games')
  t.deepEqual(tally(res.games), { win: 72, loss: 10 }, 'the 72–10 season')
  t.deepEqual(
    res.playoffs.map((s) => s.length),
    [3, 5, 4, 6],
    'four playoff rounds to the title'
  )
  const g1 = res.games[0]
  t.equal(g1.opponent, 'Charlotte Hornets', 'opponent resolved for the era')
  t.deepEqual(g1.result, { us: 105, them: 91 }, 'score from {{NBA game br}}')
  t.equal(g1.leaders.points, 'Michael Jordan (42)', 'high scorer')
  t.end()
})

test('1985-86 celtics: external-link scores', (t) => {
  const res = fixture('1985-86-boston-celtics.txt', '1985–86 Boston Celtics season').nbaSeason()
  t.equal(res.games.length, 82, 'all 82 games')
  t.deepEqual(tally(res.games), { win: 67, loss: 15 }, 'outcomes match the 67–15 record')
  const g1 = res.games[0]
  t.equal(g1.opponent, 'New Jersey Nets', 'opponent from season-page link')
  t.equal(g1.home, false, 'away game from @ marker')
  t.deepEqual(g1.result, { us: 109, them: 113 }, "'L 109–113 (OT)' link text parsed")
  t.equal(g1.outcome, 'loss', 'loss')
  t.equal(g1.overtime, true, 'overtime from the score suffix')
  t.deepEqual(
    res.playoffs.map((s) => s.length),
    [3, 5, 4, 6],
    'four playoff rounds'
  )
  t.end()
})

test('2024 bills: nfl schedule tables + postseason template', (t) => {
  const res = fixture('2024-buffalo-bills.txt', '2024 Buffalo Bills season').nflSeason()
  t.equal(res.team, 'Buffalo Bills', 'team')
  t.equal(res.games.length, 17, 'seventeen games, bye-week excluded')
  t.deepEqual(tally(res.games), { win: 13, loss: 4 }, 'outcomes match the 13–4 record')

  const g1 = res.games[0]
  t.equal(g1.opponent, 'Arizona Cardinals', 'opponent from season-page link')
  t.equal(g1.home, true, 'home game - no at-marker')
  t.deepEqual(g1.result, { us: 34, them: 28 }, "ours-first 'W 34–28' result")
  t.equal(g1.venue, 'Highmark Stadium', 'venue')

  t.equal(res.playoffs.length, 3, 'three playoff games, flat')
  const afccg = res.playoffs[2]
  t.equal(afccg.opponent, 'Kansas City Chiefs', 'playoff opponent')
  t.equal(afccg.home, false, "away game from 'at' marker")
  t.deepEqual(afccg.result, { us: 29, them: 32 }, 'playoff loss score')

  t.deepEqual(res.standings.record, { wins: 13, losses: 4, games: 17, winPct: 0.765 }, 'infobox record')
  t.equal(res.standings.division, 'AFC East', 'division split from place')
  t.equal(res.standings.divisionPlace, 1, 'division place')
  t.end()
})

test('1995 cowboys: older nfl format', (t) => {
  const res = fixture('1995-dallas-cowboys.txt', '1995 Dallas Cowboys season').nflSeason()
  t.equal(res.games.length, 16, 'sixteen games')
  t.deepEqual(tally(res.games), { win: 12, loss: 4 }, 'outcomes match the 12–4 record')
  t.equal(res.playoffs.length, 3, 'three playoff games')
  t.equal(res.playoffs.filter((g) => g.win).length, 3, 'won the super bowl')
  t.end()
})

test('2024 la galaxy: football-box matches', (t) => {
  const res = fixture('2024-la-galaxy.txt', '2024 LA Galaxy season').mlsSeason()
  t.equal(res.team, 'LA Galaxy', 'team')
  t.equal(res.games.length, 34, 'all 34 league matches, cups + preseason excluded')
  t.deepEqual(tally(res.games), { win: 19, loss: 8, tie: 7 }, 'outcomes match the 19–8–7 record')

  const g1 = res.games[0]
  t.equal(g1.opponent, 'Inter Miami CF', 'opponent from the box')
  t.equal(g1.home, true, 'team1 is the home side')
  t.equal(g1.outcome, 'tie', 'draw from result param')
  t.deepEqual(g1.result, { us: 1, them: 1 }, 'score')
  t.equal(g1.attendance, 27642, 'attendance')
  t.equal(g1.stadium, 'Dignity Health Sports Park', 'stadium')

  t.equal(res.playoffs.length, 5, 'five playoff matches')
  const final = res.playoffs.at(-1)
  t.equal(final.round, 'Final', 'mls cup final')
  t.equal(final.opponent, 'New York Red Bulls', 'final opponent')
  t.equal(final.win, true, 'won the cup')

  t.deepEqual(res.standings.record, { wins: 19, losses: 8, ties: 7, games: 34, winPct: 0.559 }, 'computed record')
  t.equal(res.standings.stadium, 'Dignity Health Sports Park', 'stadium from infobox')
  t.end()
})

test('1996 dc united: first mls season', (t) => {
  const res = fixture('1996-dc-united.txt', '1996 D.C. United season').mlsSeason()
  t.equal(res.games.length, 32, 'all 32 league matches')
  t.equal(res.playoffs.length, 6, 'six playoff matches')
  t.equal(res.playoffs.filter((g) => g.win).length, 5, 'won the first mls cup')
  const g1 = res.games[0]
  t.ok(g1.opponent, 'opponent present')
  t.ok(g1.date, 'date present')
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
