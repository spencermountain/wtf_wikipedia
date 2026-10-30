import test from 'tape'
import wtf from './_lib.js'

// a ~2017-era nhl page: plain wikitable, opponent column, '@' away marker
const nhlPage = `{{Infobox ice hockey team season
| season = 2017–18
| team = Toronto Maple Leafs
| record = 49–26–7
| division_place = 3rd
| conference_place = 4th
| goals_for = 277
}}
The '''2017–18 Toronto Maple Leafs season''' was the 101st season.

==Schedule and results==
===Regular season===
{| class="wikitable"
! # !! Date !! Opponent !! Score !! OT !! Attendance !! Record !! Pts
|- style="background:#cfc;"
| 1 || October 4 || @ Winnipeg Jets || 7–2 || || 15,321 || 1–0–0 || 2
|- style="background:#cfc;"
| 2 || October 7 || New York Rangers || 8–5 || || 19,108 || 2–0–0 || 4
|- style="background:#ffb;"
| 3 || January 2 || @ Boston Bruins || 3–4 || OT || 17,565 || 2–0–1 || 5
|}

==Skaters==
{| class="wikitable"
! Player !! GP !! G !! A !! Pts !! +/−
|-
| Auston Matthews || 62 || 34 || 29 || 63 || 18
|-
| Total || 82 || 1 || 1 || 1 || 1
|}
`

// a ~2017-era mlb page: plain wikitable game log
const mlbPage = `The '''2017 Washington Nationals season''' was the 13th season.

==Game log==
{| class="wikitable"
! Date !! Opponent !! Score !! Win !! Loss !! Save !! Attendance !! Record
|- style="background:#bfb;"
| April 3 || Marlins || 4–2 || Strasburg (1–0) || Volquez (0–1) || Glover (1) || 42,744 || 1–0
|- style="background:#fbb;"
| April 5 || Marlins || 6–4 || Ureña (1–0) || Roark (0–1) || — || 22,450 || 1–1
|}
`

test('old nhl page', (t) => {
  const res = wtf(nhlPage, { title: '2017–18 Toronto Maple Leafs season' }).nhlSeason()
  t.equal(res.team, 'Toronto Maple Leafs', 'team from title')
  t.equal(res.year, 2017, 'year from title')
  t.equal(res.games.length, 3, 'three games')
  const g1 = res.games[0]
  t.equal(g1.opponent, 'Winnipeg Jets', '@ stripped from opponent')
  t.equal(g1.home, false, 'away game')
  t.equal(g1.date, 'October 4 2017', 'fall game gets season year')
  t.deepEqual(g1.result, { us: 7, them: 2 }, 'win score oriented')
  t.equal(g1.outcome, 'win', 'win from row color')
  t.equal(res.games[1].attendance, 19108, 'attendance')
  t.equal(res.games[1].points, 4, 'cumulative points')
  const g3 = res.games[2]
  t.equal(g3.date, 'January 2 2018', 'winter game gets next year')
  t.equal(g3.outcome, 'otl', 'overtime loss from yellow row')
  t.equal(g3.overtime, true, 'OT flag')
  t.deepEqual(g3.result, { us: 3, them: 4 }, 'otl score oriented')
  t.equal(g3.win, false, 'otl is not a win')
  // the infobox
  t.deepEqual(res.season.record, { wins: 49, losses: 26, otLosses: 7, games: 82, winPct: 0.598 }, 'season record')
  t.equal(res.standings.divisionPlace, 3, 'division place')
  t.equal(res.standings.conferencePlace, 4, 'conference place')
  t.equal(res.standings.goalsFor, 277, 'goals for')
  // the roster
  t.deepEqual(
    res.skaters.map((p) => p.name),
    ['Auston Matthews'],
    'skaters exclude Total row'
  )
  t.equal(res.skaters[0].points, 63, 'player points')
  t.end()
})

test('old mlb page', (t) => {
  const res = wtf(mlbPage, { title: '2017 Washington Nationals season' }).mlbSeason()
  t.equal(res.year, 2017, 'year')
  t.equal(res.team, 'Washington Nationals', 'team')
  t.equal(res.games.length, 2, 'two games')
  const g1 = res.games[0]
  t.equal(g1.opponent, 'Miami Marlins', 'short name resolved to full team')
  t.equal(g1.home, true, 'home game')
  t.equal(g1.win, true, 'first game won')
  t.deepEqual(g1.pitchers, { win: 'Strasburg', loss: 'Volquez', save: 'Glover' }, 'pitchers stripped')
  t.deepEqual(res.games[1].result, { us: 4, them: 6 }, 'loss score oriented')
  t.equal(res.games[1].pitchers.loss, 'Roark', 'losing pitcher')
  t.equal(res.games[1].pitchers.save, null, 'dash means no save')
  t.equal(res.games[1].attendance, 22450, 'attendance')
  t.end()
})

test('no-color rows fall back to the record column', (t) => {
  const page = `The '''2017 Washington Nationals season''' was the 13th season.

==Game log==
{| class="wikitable"
! Date !! Opponent !! Score !! Record
|-
| April 3 || Marlins || 4–2 || 1–0
|-
| April 5 || @ Marlins || 6–4 || 1–1
|}
`
  const res = wtf(page, { title: '2017 Washington Nationals season' }).mlbSeason()
  t.equal(res.games[0].outcome, 'win', 'wins column went up')
  t.equal(res.games[1].outcome, 'loss', 'losses column went up')
  t.deepEqual(res.games[1].result, { us: 4, them: 6 }, 'winner-first score flipped for a loss')
  t.end()
})

test('1980s nhl: month-named date columns', (t) => {
  // the date column is named after the month, with day-of-month cells
  const page = `The '''1980–81 New York Rangers season''' was the 55th season.

==Schedule and results==
{{Game log start|style=background:#FFFFFF;|title=1980–81 regular season}}
{{Game log section start|hide=y|style=background:#FFFFFF;|title=October: 3–7–1| Game| October| Opponent| Score| Record}}
|- {{Game-lost}}
| 1 || 9 || @ [[Boston Bruins]] || 7–2 || 0–1–0
|- {{Game-won}}
| 2 || 11 || @ [[Toronto Maple Leafs]] || 8–3 || 1–1–0
|- {{Game-tied}}
| 3 || 30 || @ [[Philadelphia Flyers]] || 3–3 || 1–1–1
|-
{{Game log section end}}
{{Game log end}}
`
  const res = wtf(page, { title: '1980–81 New York Rangers season' }).nhlSeason()
  t.equal(res.games.length, 3, 'three games')
  t.equal(res.games[0].date, 'October 9 1980', 'date from month-column')
  t.equal(res.games[0].opponent, 'Boston Bruins', 'opponent')
  t.equal(res.games[0].outcome, 'loss', 'loss from game-lost template')
  t.deepEqual(res.games[0].result, { us: 2, them: 7 }, 'winner-first score flipped')
  t.equal(res.games[1].outcome, 'win', 'win')
  t.equal(res.games[2].outcome, 'tie', 'tie')
  t.deepEqual(res.games[2].record, { wins: 1, losses: 1, ties: 1, games: 3, winPct: 0.333 }, 'pre-2005 ties')
  t.end()
})

test('1980s mlb: dow-tooltip dates', (t) => {
  const page = `The '''1981 Los Angeles Dodgers season''' was the 92nd season.

==Game log==
{{Game log start|title=1981 regular season game log}}
{{Game log section start|hide=y|title=April: 14–5|#|Date|Opponent|Score|Win|Loss|Save|Attendance|Record}}
|- bgcolor=#bfb
| 1 || {{dow tooltip|April 9, 1981}} || [[1981 Houston Astros season|Astros]] || '''W''' 2–0 || '''[[Fernando Valenzuela|Valenzuela]]''' (1–0) || [[Phil Niekro|Niekro]] (0–1) || — || 50,511 || 1–0
|-
{{Game log section end}}
{{Game log end}}
`
  const res = wtf(page, { title: '1981 Los Angeles Dodgers season' }).mlbSeason()
  t.equal(res.games.length, 1, 'one game')
  t.equal(res.games[0].date, 'April 9, 1981', 'date through the tooltip template')
  t.equal(res.games[0].opponent, 'Houston Astros', 'opponent')
  t.equal(res.games[0].outcome, 'win', 'win')
  t.equal(res.games[0].pitchers.win, 'Valenzuela', 'winning pitcher')
  t.equal(res.games[0].attendance, 50511, 'attendance')
  t.end()
})

test('2010s mlb: multi-line section opener, no headings', (t) => {
  // {{MLB game log section}} with newline-separated named params and default columns
  const page = `The '''2010 Milwaukee Brewers season''' was the 41st season.

==Regular season==
===Game log===
{{MLB game log
 | year=2010
 | bgcolor = #CBA140
}}
{{MLB game log section
 | month = April
 | record = 9–14
 | hide= y
}}
|- align="center" bgcolor="ffbbbb"
| 1 || April 5 || [[Colorado Rockies|Rockies]] || 5–3 || [[Ubaldo Jiménez|Jiménez]] (1–0) || '''[[Yovani Gallardo|Gallardo]]''' (0–1) || [[Franklin Morales|Morales]] (1) || 45,808 || 0–1
|- align="center" bgcolor="bbffbb"
| 2 || April 6 || [[Colorado Rockies|Rockies]] || 7–5 || '''[[Randy Wolf|Wolf]]''' (1–0) || [[Greg Smith (pitcher)|Smith]] (0–1) || '''[[Trevor Hoffman|Hoffman]]''' (1) || 37,344 || 1–1
|-
{{MLB game log section end}}
`
  const res = wtf(page, { title: '2010 Milwaukee Brewers season' }).mlbSeason()
  t.equal(res.games.length, 2, 'two games')
  const g1 = res.games[0]
  t.equal(g1.outcome, 'loss', 'loss from unquoted bgcolor')
  t.deepEqual(g1.result, { us: 3, them: 5 }, 'winner-first score flipped')
  t.equal(g1.opponent, 'Colorado Rockies', 'opponent from team link')
  t.equal(g1.pitchers.save, 'Morales', 'save credited')
  t.equal(res.games[1].outcome, 'win', 'win')
  t.deepEqual(res.games[1].result, { us: 7, them: 5 }, 'win score kept')
  t.end()
})

test('2012 mlb: combined opponent/time column', (t) => {
  const page = `The '''2012 St. Louis Cardinals season''' was the 131st season.

==Scheduling and Results==
===Game log===
{{Game log start|style=background:#6E8B3D|title= 2012 Game Log}}
{{Game log section start|hide=y|title=April (14–8) ({{Winning percentage|14|8}})| #| Date| Opponent / Time| Score| Win| Loss| Save| Attendance| Record}}
|- align="center" bgcolor="bbffbb"
| 1 || April 4 || @ [[Miami Marlins|Marlins]] 6:05pm ([[Wednesday Night Baseball|ESPN]]) || 4–1 || '''[[Kyle Lohse|Lohse]]''' (1–0) || [[Josh Johnson (pitcher)|Johnson]] (0–1) || '''[[Jason Motte|Motte]]''' (1) || 36,601 || [http://mlb.mlb.com/recap 1–0]
|-
{{Game log section end}}
`
  const res = wtf(page, { title: '2012 St. Louis Cardinals season' }).mlbSeason()
  t.equal(res.games.length, 1, 'one game')
  const g1 = res.games[0]
  t.equal(g1.opponent, 'Miami Marlins', 'opponent through combined column')
  t.equal(g1.home, false, 'away game')
  t.equal(g1.outcome, 'win', 'win from row color')
  t.deepEqual(g1.record, { wins: 1, losses: 0, games: 1, winPct: 1 }, 'record through external link')
  t.end()
})

test('plugin methods exist', (t) => {
  t.equal(typeof wtf(nhlPage).nhlSeason, 'function', 'doc.nhlSeason')
  t.equal(typeof wtf(mlbPage).mlbSeason, 'function', 'doc.mlbSeason')
  t.equal(typeof wtf.mlbSeason, 'function', 'wtf.mlbSeason')
  t.equal(typeof wtf.nhlSeason, 'function', 'wtf.nhlSeason')
  t.end()
})

test('empty doc parses to null-ish', (t) => {
  const res = wtf('no sports here').mlbSeason()
  t.equal(res.games.length, 0, 'no games')
  t.deepEqual(res.season, {}, 'no infobox')
  t.end()
})
