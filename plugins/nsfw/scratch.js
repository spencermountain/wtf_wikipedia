import wtf from 'wtf_wikipedia'
import plugin from './src/index.js'
wtf.extend(plugin)

// wtf.fetch('The Matrix', 'en').then((doc) => {
//   console.log(doc.nsfw().detail)
// })
// import fs from 'fs'
// let file = 'United-Kingdom'
// let str = fs.readFileSync(`./tests/cache/${file}.txt`).toString()
// let doc = wtf(str)
// console.log(JSON.stringify(doc.nsfw(), null, 2))

let res = wtf(`{{Human sexuality}}\nSome text.`).nsfw()
console.log(res)

// let doc = await wtf.fetch('Toronto Raptors')
// const warnings = doc.nsfw()
// ;[
//   {
//     content: 'weapons',
//     justification: {
//       templates: [{ name: 'beretta firearms', data: {...} }]
//     }
//   },
//   {
//     content: 'sexuality',
//     justification: {
//       templates: [{ name: 'human sexuality', data: {...} }]
//     }
//   }
// ]
