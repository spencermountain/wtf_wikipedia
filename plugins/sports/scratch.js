/* eslint-disable no-console, no-unused-vars */
import wtf from '../../src/index.ts'
import { nhl, mlb } from './src/index.js'
wtf.extend(mlb)
wtf.extend(nhl)

let res = await wtf.nhlSeason('Toronto Maple Leafs', 2024)
console.log(res.standings)
console.log(res.games.slice(0, 3))

// let res = await wtf.mlbSeason('Toronto Blue Jays', 2025)

// let doc = wtf(`...wikitext...`, { title: '2025 Toronto Blue Jays season' })
// console.log(doc.mlbSeason())
