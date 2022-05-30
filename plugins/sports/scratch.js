/* eslint-disable no-console, no-unused-vars */
import wtf from '../../src/index.js'
import { nhl, mlb } from './src/index.js'
wtf.extend(mlb)
wtf.extend(nhl)

// let res = await wtf.nhlSeason('Toronto Maple Leafs', 2017)
let res = await wtf.mlbSeason('Toronto Blue Jays', 2017)
console.log(res)

let str = `
`

// let doc = wtf(str)
// console.log(doc.mlbSeason())
// console.log(doc.templates()[0].json())