import test from 'tape'
import wtf from './_lib.js'
import parseGame from '../src/mlb/gameLog/parseGame.js'
import mlbWinner from '../src/mlb/gameLog/winner.js'
import parseRecord from '../src/nhl/parseGames/_record.js'
import nhlWinner from '../src/nhl/parseGames/win-loss.js'
import parseInfobox from '../src/nhl/infobox.js'
import parseGames from '../src/nhl/parseGames/index.js'
import parseNhl from '../src/nhl/parse.js'

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
|-
| 1 || October 4 || @ Winnipeg Jets || 7–2 || || 15,321 || 1–0–0 || 2
|-
| 2 || October 7 || New York Rangers || 8–5 || || 19,108 || 2–0–0 || 4
|-
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

const mlbPage = `The '''2017 Washington Nationals season''' was the 13th season.

==Game log==
{| class="wikitable"
! Date !! Opponent !! Score !! Win !! Loss !! Save !! Attendance !! Record
|-
| April 3 || Marlins || 4–2 || Strasburg (1–0) || Volquez (0–1) || Glover (1) || 42,744 || 1–0
|-
| April 5 || Marlins || 6–4 || Ureña (1–0) || Roark (0–1) || — || 22,450 || 1–1
|}
`

test('mlb parseGame: home game with full row', (t) => {
  const g = parseGame({
    Date: 'April 1',
    Opponent: 'Reds',
    Score: '6–5',
    Win: 'Smith (1–0)',
    Loss: 'Jones (0–1)',
    Save: 'Lee (2)',
    Attendance: '40,123',
    Record: '3–0',
  })
  t.equal(g.date, 'April 1', 'date')
  t.equal(g.team, 'Reds', 'opponent name')
  t.equal(g.home, true, 'no @ means home game')
  t.deepEqual(g.pitchers, { win: 'Smith', loss: 'Jones', save: 'Lee' }, 'pitcher records stripped')
  t.deepEqual(g.result, { winner: 6, loser: 5 }, 'score split on en-dash')
  t.equal(g.record.wins, 3, 'record wins')
  t.equal(g.record.losses, 0, 'record losses')
  t.equal(g.record.games, 3, 'record games')
  t.equal(g.record.plusMinus, 1, 'win percentage')
  t.equal(g.attendance, 40123, 'attendance commas removed')
  t.end()
})

test('mlb parseGame: variants', (t) => {
  t.equal(parseGame(null), null, 'null row')
  const lower = parseGame({ date: 'May 2', opponent: ' @ Cubs', score: '3-1', record: '10-12', attendance: '1,000' })
  t.equal(lower.date, 'May 2', 'lowercase date key')
  t.equal(lower.team, 'Cubs', 'leading-space away marker stripped')
  t.equal(lower.home, false, 'away game')
  t.deepEqual(lower.result, { winner: 3, loser: 1 }, 'hyphen score')
  t.equal(lower.record.games, 22, 'hyphen record')
  t.equal(lower.record.plusMinus, 0.45, 'win pct rounded to 2 places')
  t.deepEqual(parseGame({ Score: 'W 6–5' }).result, { winner: 6, loser: 5 }, 'W prefix removed from score')
  t.deepEqual(parseGame({ Score: 'L 2–9' }).result, { winner: 2, loser: 9 }, 'L prefix removed from score')
  t.deepEqual(parseGame({ Score: 'Postponed' }).result, {}, 'non-score result is empty')
  t.equal(parseGame({ Save: '–' }).pitchers.save, null, 'en dash save means no save')
  t.equal(parseGame({ Attendance: 'Rogers Centre (23,987)' }).attendance, 23987, 'attendance inside parentheses')
  t.equal(
    parseGame({ 'Location (Attendance)': 'Fenway Park (37,499)' }).attendance,
    37499,
    'location (attendance) column'
  )
  t.equal(parseGame({ Attendance: '' }).attendance, null, 'missing attendance is null')
  t.equal(parseGame({ 'Box Score': '7–0' }).result.winner, 7, 'box score column')
  t.end()
})

test('mlb parseGame: away marker and em dash', (t) => {
  t.equal(parseGame({ Opponent: '@ Reds' }).team, 'Reds', '"@ Reds" should strip the @ marker')
  t.equal(parseGame({ Save: '—' }).pitchers.save, null, 'em dash save should mean no save')
  t.end()
})

test('mlb addWinner', (t) => {
  const games = mlbWinner([
    { record: { wins: 1 }, result: { winner: 4, loser: 2 } },
    { record: { wins: 1 }, result: { winner: 5, loser: 3 } },
    { record: { wins: 2 }, result: { winner: 9, loser: 1 } },
  ])
  t.deepEqual(
    games.map((g) => g.win),
    [true, false, true],
    'wins inferred from record'
  )
  t.deepEqual(games[0].result, { us: 4, them: 2 }, 'win: us=winner')
  t.deepEqual(games[1].result, { us: 3, them: 5 }, 'loss: us=loser')
  t.end()
})

test('nhl record parsing', (t) => {
  t.deepEqual(parseRecord('49–26–7'), { wins: 49, losses: 26, ties: 7, games: 82 }, 'en dash W-L-OT')
  t.deepEqual(parseRecord('10-5'), { wins: 10, losses: 5, ties: 0, games: 15 }, 'hyphen, two parts')
  t.deepEqual(parseRecord('3−1−1'), { wins: 3, losses: 1, ties: 1, games: 5 }, 'minus sign')
  t.deepEqual(parseRecord(''), { wins: 0, losses: 0, ties: 0, games: 0 }, 'empty')
  t.deepEqual(parseRecord(), { wins: 0, losses: 0, ties: 0, games: 0 }, 'undefined')
  t.end()
})

test('nhl addWinner', (t) => {
  const games = nhlWinner([
    { record: { wins: 1 }, result: { win: 7, loss: 2 } },
    { record: { wins: 1 }, result: { win: 5, loss: 3 } },
    { record: { wins: 2 }, result: { win: 4, loss: 1 } },
  ])
  t.equal(games[0].win, true, 'record went up: win')
  t.equal(games[1].win, null, 'record unchanged: undecided (loss/OT)')
  t.equal(games[2].win, true, 'record up again: win')
  t.deepEqual(games[0].result, { us: 7, them: 2 }, 'win result')
  t.deepEqual(games[1].result, { us: 3, them: 5 }, 'non-win result flipped')
  t.end()
})

test('nhl infobox', (t) => {
  const data = parseInfobox(wtf(nhlPage))
  t.equal(data.team, 'Toronto Maple Leafs', 'team')
  t.equal(data.season, '2017–18', 'season text kept')
  t.equal(data.division_place, 3, 'ordinal → number')
  t.equal(data.conference_place, 4, 'ordinal → number')
  t.equal(data.goals_for, 277, 'numeric string → number')
  t.deepEqual(data.record, { wins: 49, losses: 26, ties: 7, games: 82 }, 'record parsed')
  t.deepEqual(parseInfobox(wtf('no infobox here')), {}, 'missing infobox')
  t.end()
})

test('nhl season page parse', (t) => {
  const meta = { team: 'Toronto Maple Leafs', year: 2017 }
  let games = []
  t.doesNotThrow(() => (games = parseGames(wtf(nhlPage), meta)), 'parseGames runs')
  t.equal(games.length, 3, 'three games')
  t.equal(games[0]?.opponent, 'Winnipeg Jets', '@ stripped from opponent')
  t.equal(games[0]?.date, 'October 4 2017', 'fall game gets season year')
  t.equal(games[2]?.date, 'January 2 2018', 'winter game gets next year')
  t.equal(games[2]?.overtime, true, 'OT flag')
  t.equal(games[1]?.attendance, 19108, 'attendance')
  t.equal(games[1]?.points, 4, 'points')
  let res = {}
  t.doesNotThrow(() => (res = parseNhl(wtf(nhlPage, { title: '2017–18 Toronto Maple Leafs season' }))), 'parse runs')
  t.equal(res.team, 'Toronto Maple Leafs', 'team from title')
  t.equal(res.year, 2017, 'year from title')
  t.deepEqual(
    res.roster?.map((p) => p.name),
    ['Auston Matthews'],
    'roster excludes Total row'
  )
  t.equal(res.roster?.[0]?.points, 63, 'player points')
  t.end()
})

test('nhl doc method', (t) => {
  t.equal(typeof wtf(nhlPage).nhlSeason, 'function', 'doc.nhlSeason exists')
  t.end()
})

test('mlb doc method', (t) => {
  t.equal(typeof wtf(mlbPage).mlbSeason, 'function', 'doc.mlbSeason exists')
  t.equal(typeof wtf.mlbSeason, 'function', 'wtf.mlbSeason exists')
  t.equal(typeof wtf.nhlSeason, 'function', 'wtf.nhlSeason exists')
  t.end()
})

test('mlb season page parse', (t) => {
  let res = {}
  t.doesNotThrow(
    () => (res = wtf(mlbPage, { title: '2017 Washington Nationals season' }).mlbSeason()),
    'mlbSeason runs'
  )
  t.equal(res.year, 2017, 'year')
  t.equal(res.team, 'Washington Nationals', 'team')
  t.equal(res.games?.length, 2, 'two games')
  t.equal(res.games?.[0]?.win, true, 'first game won')
  t.deepEqual(res.games?.[1]?.result, { us: 4, them: 6 }, 'second game lost')
  t.equal(res.games?.[1]?.pitchers?.loss, 'Roark', 'losing pitcher')
  t.end()
})
