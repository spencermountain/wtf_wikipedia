var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/wikitext/src'))

const fs = require('fs')
let txt = fs.readFileSync('/Users/spencer/mountain/wtf_wikipedia/tests/cache/Altimont-Butler.txt').toString()

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
// var have = wtf(txt).wikitext()
// console.log(have)

txt = `[[Kategorie:Klinischer Psychologe]]
[[Kategorie:US-Amerikaner]]`

console.log(wtf(txt).categories())
