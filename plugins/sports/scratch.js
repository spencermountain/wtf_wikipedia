/* eslint-disable no-console, no-unused-vars */
import wtf from '../../src/index.js'
import { nhl, mlb } from './src/index.js'
wtf.extend(mlb)
// wtf.extend(nhl)

let res = await wtf.getSeason('Toronto Maple Leafs', 2021)
console.log(res)

let str = `
`

// let doc = wtf(str)
// console.log(doc.mlbSeason())
// console.log(doc.templates()[0].json())