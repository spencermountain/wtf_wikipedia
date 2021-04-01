const wtf = require('./src/index')
wtf.extend(require('./plugins/wikis/wikivoyage/plugin'))

let str = `{{mile|2|on}}`
let doc = wtf(str)
console.log(doc.templates())
console.log(doc.text())
