import { readFileSync } from 'node:fs'
import test from 'tape'
import wtf from './_lib.js'

const fixture = (file, title) => {
  const str = readFileSync(new URL(`fixtures/${file}`, import.meta.url), 'utf8')
  return wtf(str, { title })
}

// one modern fixture per league
const leagues = {
  mlb: ['2025-toronto-blue-jays.txt', '2025 Toronto Blue Jays season'],
  nhl: ['2024-25-toronto-maple-leafs.txt', '2024–25 Toronto Maple Leafs season'],
  nba: ['2024-25-toronto-raptors.txt', '2024–25 Toronto Raptors season'],
  nfl: ['2024-buffalo-bills.txt', '2024 Buffalo Bills season'],
  mls: ['2024-la-galaxy.txt', '2024 LA Galaxy season'],
  wnba: ['2024-las-vegas-aces.txt', '2024 Las Vegas Aces season'],
  nwsl: ['2024-kansas-city-current.txt', '2024 Kansas City Current season'],
  pwhl: ['2024-25-minnesota-frost.txt', '2024–25 Minnesota Frost season'],
  cfl: ['2024-toronto-argonauts.txt', '2024 Toronto Argonauts season'],
  ahl: ['2023-24-hershey-bears.txt', '2023–24 Hershey Bears season'],
  epl: ['2023-24-luton-town.txt', '2023–24 Luton Town F.C. season'],
}

test('every league returns the same core shape', (t) => {
  Object.entries(leagues).forEach(([league, [file, title]]) => {
    const res = fixture(file, title)[`${league}Season`]()
    const s = res.standings
    t.equal(typeof s.coach, 'string', `${league} standings.coach`)
    t.equal(typeof s.gm, 'string', `${league} standings.gm`)
    t.equal(typeof s.venue, 'string', `${league} standings.venue`)
    t.ok('place' in s, `${league} standings.place`)
    t.ok('record' in s, `${league} standings.record`)
    t.ok('start' in res && 'end' in res, `${league} start/end dates`)
    t.ok('attendance' in res, `${league} attendance`)
    t.ok(Array.isArray(res.roster), `${league} roster is an array`)
    t.ok(Array.isArray(res.playoffs) || typeof res.cups === 'object', `${league} playoffs or cups`)
    res.roster.slice(0, 3).forEach((p) => {
      t.equal(typeof p.name, 'string', `${league} roster name`)
      t.ok('number' in p && 'position' in p, `${league} roster number+position`)
    })
  })
  t.end()
})

test('standard values: coach, gm, venue, place', (t) => {
  const mlb = fixture(...leagues.mlb).mlbSeason()
  t.equal(mlb.standings.coach, 'John Schneider', 'mlb manager as coach')
  t.equal(mlb.standings.gm, 'Ross Atkins', 'mlb gm')
  t.equal(mlb.standings.venue, 'Rogers Centre', 'mlb ballpark as venue')
  t.equal(mlb.standings.place, 1, 'mlb division place')
  t.equal(mlb.playoffs, mlb.postseason, 'playoffs aliases postseason')
  t.equal(mlb.start, 'March 27 2025', 'mlb opening day')
  t.equal(mlb.end, 'September 28 2025', 'mlb last game')
  t.equal(mlb.attendance, 35184, 'mlb average home attendance')
  t.deepEqual(mlb.roster[0], { number: 67, name: 'Jacob Barnes', position: '' }, 'mlb roster row')

  const nhl = fixture(...leagues.nhl).nhlSeason()
  t.equal(nhl.standings.coach, 'Craig Berube', 'nhl coach from infobox')
  t.equal(nhl.standings.gm, 'Brad Treliving', 'nhl gm')
  t.equal(nhl.standings.venue, 'Scotiabank Arena', 'nhl arena as venue')
  t.equal(nhl.standings.place, 1, 'nhl division place')

  const nba = fixture(...leagues.nba).nbaSeason()
  t.equal(nba.standings.gm, 'Bobby Webster', 'nba gm')
  t.deepEqual(
    nba.roster[0],
    {
      number: 30,
      name: 'Ochai Agbaji',
      position: 'G/F',
      height: `6'6"`,
      weight: 215,
      college: 'Kansas',
      dob: '2000-04-20',
      nation: '',
    },
    'nba roster row normalized'
  )

  const epl = fixture(...leagues.epl).eplSeason()
  t.equal(epl.standings.coach, 'Rob Edwards', 'epl manager as coach')
  t.equal(epl.standings.place, 18, 'epl place is a plain number')
  t.equal(epl.standings.position, '18th (relegated)', 'epl position keeps the note')
  t.equal(epl.roster, epl.squad, 'roster aliases squad')
  t.equal(epl.attendance, 11278, 'epl average home attendance')
  t.end()
})

test('mls: cups and squad come along', (t) => {
  const res = fixture(...leagues.mls).mlsSeason()
  t.equal(res.standings.place, 4, 'overall place from the combined position field')
  t.equal(res.cups['Leagues Cup'].length, 3, 'leagues-cup run in cups')
  t.equal(res.playoffs.length > 0, true, 'playoffs stay separate from cups')
  t.equal(res.roster.length, 26, 'squad templates parsed')
  t.deepEqual(res.roster[0], { number: 2, name: 'Miki Yamane', position: 'DF', nation: 'JPN' }, 'mls squad row')
  t.end()
})

test('nwsl: cups and squad come along', (t) => {
  const res = fixture(...leagues.nwsl).nwslSeason()
  t.equal(res.cups['NWSL x Liga MX Femenil Summer Cup'].length, 5, 'summer-cup run in cups')
  t.equal(res.roster.length, 32, 'squad templates parsed')
  t.equal(res.standings.venue, 'CPKC Stadium', 'capacity note stripped from venue')
  t.equal(res.attendance, 11500, 'sold-out season average')
  t.end()
})

test('ahl: infobox fallbacks when the page has no game log', (t) => {
  const res = fixture(...leagues.ahl).ahlSeason()
  t.equal(res.start, null, 'no games, no start date')
  t.equal(res.attendance, 9439, 'average attendance from the infobox')
  t.equal(res.standings.gm, 'Bryan Helmer (de facto - VP of Hockey Operations)', 'ahl gm')
  t.end()
})
