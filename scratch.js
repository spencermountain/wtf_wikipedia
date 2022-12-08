import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `= some heading =
after
`

str = `
{{Infobox officeholder
|successor1		= [[Wistin Abela]]
|term_end2		= March 1997
|alma_mater             = [[St Peter's College, Oxford]]
}}

`
let doc = wtf(str)
console.log(doc.infobox().json())
// console.log('after')

// wtf.fetch('December_1').then((doc) => {
// })