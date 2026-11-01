<div align="center">
  <div><b>wtf-plugin-sports</b></div>
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a sports-season plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-sports">
    <img src="https://img.shields.io/npm/v/wtf-plugin-sports.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-sports/builds/wtf-plugin-sports.min.js">
    <img src="https://img.shields.io/bundlephobia/min/wtf-plugin-sports" />
  </a>
</div>

<div align="center">
  <code>npm install wtf-plugin-sports</code>
</div>

Wikipedia keeps surprisingly-good game-by-game data for every pro sports team,
but it lives in hard-to-parse game-log tables and templates, whose formats have
drifted over the years. This plugin absorbs that - row-colour win/loss markers,
`{{Game-won}}` templates, visitor/home vs opponent columns, old and new game-log
templates - and returns the same tidy schema for any season since the 1990s.

```js
import wtf from 'wtf_wikipedia'
import { mlb, nhl, nba, nfl, mls } from 'wtf-plugin-sports'
wtf.extend(mlb)
wtf.extend(nhl)
wtf.extend(nba)
wtf.extend(nfl)
wtf.extend(mls)

let season = await wtf.nhlSeason('Toronto Maple Leafs', 2024)
season.standings.record
// { wins: 52, losses: 26, otLosses: 4, games: 82, winPct: 0.634 }
season.games[8]
/* {
  game: 9,
  date: 'October 26 2024',
  opponent: 'Boston Bruins',
  home: false,
  outcome: 'otl',
  win: false,
  result: { us: 3, them: 4 },
  overtime: true,
  record: { wins: 4, losses: 4, otLosses: 1, games: 9, winPct: 0.444 },
  attendance: 17850,
  points: 9,
  decision: 'Stolarz'
} */
season.playoffs // one array of games per series
season.skaters // [{ name, games, goals, assists, points, plusMinus }]
season.goalies // [{ name, games, wins, losses, savePct, ... }]
```

```js
let season = await wtf.mlbSeason('Toronto Blue Jays', 2025)
season.games[0]
/* {
  game: 1,
  date: 'March 27 2025',
  opponent: 'Baltimore Orioles',
  home: true,
  outcome: 'loss',
  win: false,
  result: { us: 2, them: 12 },
  record: { wins: 0, losses: 1, games: 1, winPct: 0 },
  attendance: 40734,
  pitchers: { win: 'Eflin', loss: 'Berríos', save: null },
  gamesBack: '1'
} */
season.postseason // one array of games per series
season.roster // {{MLBplayer}} rows
season.playerStats // { batters: [...], pitchers: [...] }
```

Each game's `outcome` is one of `win`, `loss`, `otl`, `tie`, `postponed`, or
`null` - read from the row's styling when available, or inferred from the
running record column. `win` is a convenience boolean (`null` when undecided).

Team names resolve across renames and relocations - asking for the
`('Cleveland Guardians', 2015)` season fetches the Indians page, and
`('Arizona Coyotes', 2026)` finds the Utah Mammoth. Old names work too.

```js
let season = await wtf.nbaSeason('Chicago Bulls', 1995)
season.standings.record // { wins: 72, losses: 10, games: 82, winPct: 0.878 }
season.games[0]
/* {
  game: 1,
  date: 'November 3 1995',
  opponent: 'Charlotte Hornets',
  home: true,
  outcome: 'win',
  win: true,
  result: { us: 105, them: 91 },
  record: { wins: 1, losses: 0, games: 1, winPct: 1 },
  leaders: { points: 'Michael Jordan (42)', rebounds: 'Dennis Rodman (11)', assists: 'Michael Jordan (7)' },
  location: 'United Center',
  attendance: 23652
} */
season.playoffs // one array of games per round
season.roster // {{player2}} rows
season.playerStats // { season: [{ name, games, pointsPerGame, ... }], playoffs: [...] }
```

```js
let season = await wtf.nflSeason('New England Patriots', 2007)
season.standings.record // { wins: 16, losses: 0, games: 16, winPct: 1 }
season.games[0]
/* {
  game: 1,
  date: 'September 9 2007',
  opponent: 'New York Jets',
  home: false,
  outcome: 'win',
  win: true,
  result: { us: 38, them: 14 },
  record: { wins: 1, losses: 0, games: 1, winPct: 1 },
  venue: 'Giants Stadium'
} */
season.playoffs // single games, kept flat
```

```js
let season = await wtf.mlsSeason('LA Galaxy', 2024)
season.standings.record // { wins: 19, losses: 8, ties: 7, games: 34, winPct: 0.559 }
season.games[0]
/* {
  date: 'February 25 2024',
  opponent: 'Inter Miami CF',
  home: true,
  outcome: 'tie',
  win: false,
  result: { us: 1, them: 1 },
  round: '1',
  stadium: 'Dignity Health Sports Park',
  location: 'Carson, California',
  attendance: 27642
} */
season.playoffs // mls cup playoff matches, flat
```

The methods also hang off any parsed document:

```js
let doc = await wtf.fetch('2002–03 Toronto Maple Leafs season')
doc.nhlSeason().season.record
// { wins: 44, losses: 28, ties: 7, otLosses: 3, games: 82, winPct: 0.537 }
```

MIT
