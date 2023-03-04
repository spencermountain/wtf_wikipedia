import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)

let str = ` 
{{Infobox officeholder
  | predecessor2        = [[Dick Cheney]]
  | successor2          = [[Mike Pence]]
  | jr/sr3              = United States Senator
  | term_end3           = January 15, 2009 
}}`

let doc = wtf(str)
console.log(doc.infobox().json())

// let res = await wtf.getIncoming('Python (programming language)')
// console.log(res)
// console.log(res.length)