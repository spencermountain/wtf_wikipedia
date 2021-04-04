const wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))

// one
// let str = `[[one]] and [[two]] {{one}} and {{two}}`
// let doc = wtf(str)
// console.log(doc.templates(1)[0].json())

let str = `{{Infobox country
| common_name = United Kingdom
}}
`
let obj = wtf(str).infobox(0).json()
console.log(obj)
