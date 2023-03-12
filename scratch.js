import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)

let str = ` 
{{Infobox officeholder
|term_start   = {{start date|2022|May|6}}
|term_end     = {{end date|2023|January|11}}
}}`

let doc = wtf(str)
console.log(doc.infobox().json())

// let res = await wtf.getIncoming('Python (programming language)')
// console.log(res)
// console.log(res.length)