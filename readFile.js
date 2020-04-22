var wtf = require('./src/index')
wtf.extend(require('./plugins/summary/src'))

let file = 'United-Kingdom'
let str = require('fs').readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`).toString()

let doc = wtf(str)
console.log(JSON.stringify(doc.summary(), null, 2))
