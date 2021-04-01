const wtf = require('./src/index')
wtf.extend(require('./plugins/wikis/wiktionary/plugin'))

let str = `{{hyphenation|en|mea|sure}}`
let doc = wtf(str)
console.log(doc.templates())
console.log(doc.text())
console.log(doc.link(0))
