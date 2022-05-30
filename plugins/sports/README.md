<div align="center">
  <img src="https://cloud.githubusercontent.com/assets/399657/23590290/ede73772-01aa-11e7-8915-181ef21027bc.png" />

  <div>a plugin for <a href="https://github.com/spencermountain/wtf_wikipedia/">wtf_wikipedia</a></div>
  
  <!-- npm version -->
  <a href="https://npmjs.org/package/wtf-plugin-sports">
    <img src="https://img.shields.io/npm/v/wtf-plugin-sports.svg?style=flat-square" />
  </a>
  
  <!-- file size -->
  <a href="https://unpkg.com/wtf-plugin-sports/builds/wtf-plugin-sports.min.js">
    <img src="https://badge-size.herokuapp.com/spencermountain/wtf-plugin-html/master/builds/wtf-plugin-sports.min.js" />
  </a>
   <hr/>
</div>

<div align="center">
  <code>npm install wtf-plugin-sports</code>
</div>

```js
import wtf from 'wtf_wikipedia'
import {mlb, nhl} from 'wtf-plugin-sports'
wtf.extend(nhl)

let res = await wtf.getSeason('Toronto Maple Leafs', 2018)
```

### MLB

wtf-mlb gets structured data for mlb baseball teams, supports a bunch of different variants of mlb game log variations, and tries to cleanup some complicated parts of wikipedia sometimes in the wild.

```js
import wtf from 'wtf_wikipedia'
import {mlb} from 'wtf-plugin-sports'
wtf.extend(mlb)

wtf.getSeason('Toronto Blue Jays', 2018).then((data) => {
  console.log(data)
  /*{
  games: [{
      date: 'April 1',
      team: 'Reds',
      home: false,
      result: { us: 6, them: 5, win: true },
      record: { wins: 3, losses: 0, games: 3
    },
    ...
  ],
  postseason: [...],
  roster: [],
  draftPicks: [],
  playerStats: [] 
}*/
})
```

<div align="center">
  <h2><a href="https://observablehq.com/@spencermountain/wikipedia-baseball-table-parser">Demo</a></h2>
</div>

### NHL

wtf-nhl gets structured data for nhl hockey teams, supports a bunch of different variants of nhl game log variations, and tries to cleanup some complicated parts of wikipedia sometimes in the wild.

```js
import wtf from 'wtf_wikipedia'
import {nhl} from 'wtf-plugin-sports'
wtf.extend(nhl)

wtf.getSeason('Toronto Maple Leafs', 2018).then((data) => {
  console.log(data)
  /*{
  games: [
    { 
      game: 82,
      date: 'April 7 2018',
      opponent: 'Montreal Canadiens',
      result: {
        "us": 4,
        "them": 2
      },
      overtime: false,
      record: {
        "wins": 49,
        "losses": 26,
        "ties": 7,
        "games": 82
      },
      attendance: null,
      points: 105,
      win: true 
    },
    ...
  ],
  roster: [
    {
      "name": "Ron Hainsey",
      "games": 80,
      "goals": 4,
      "assists": 19,
      "points": 23,
      "plusMinus": 12
    },
    ...
  ],
}*/
})
```

<div align="center">
  <h2><a href="https://observablehq.com/@spencermountain/wtf-plugin-nhl">Demo</a></h2>
</div>


work-in-progress

MIT
