/* eslint-disable no-console, no-unused-vars */
import wtf from '../../src/index.js'
import { nhl, mlb } from './src/index.js'
wtf.extend(mlb)
wtf.extend(nhl)


wtf.nhlSeason('Washington Capitals', 2017).then((res) => {
  console.log(res)

})
// let res = await wtf.mlbSeason('Washington Nationals', 2017)

let str = `
`

// let doc = wtf(str)
// console.log(doc.mlbSeason())
// console.log(doc.templates()[0].json())