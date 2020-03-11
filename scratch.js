var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/wikitext/src'))

// const fs = require('fs')
// let txt = fs.readFileSync('/Users/spencer/mountain/wtf_wikipedia/tests/cache/Altimont-Butler.txt').toString()

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
// var have = wtf(txt).wikitext()
// console.log(have)

console.log(wtf('i ***am*** a weiner.').wikitext())
