import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `= some heading =
after
`

str = `
[[File:Jewish people around the world.svg|thumb|Map of the Jewish diaspora.<br />
{{Legend|#000000|Israel}}
{{Legend|#00216bff|+ 1,000,000}}
{{Legend|#0038b8ff|+ 100,000}}
{{Legend|#578bffff|+ 10,000}}
{{Legend|#b3cbffff|+ 1,000}}|240x240px]]
`
let doc = wtf(str)
console.log(doc.images())
// console.log('after')

// wtf.fetch('December_1').then((doc) => {
// })

// wtf
//   .fetch(['Royal Cinema', 'Aldous Huxley'], {
//     lang: 'en',
//     'Api-User-Agent': 'spencermountain@gmail.com',
//   })
//   .then((docList) => {
//     let links = docList.map((doc) => doc.links())
//     console.log(links)
//   })