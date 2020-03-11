var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/wikitext/src'))

let txt = require('fs')
  .readFileSync('/Users/spencer/mountain/wtf_wikipedia/tests/cache/royal_cinema.txt')
  .toString()

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
// var have = wtf(txt).wikitext()
// console.log(have)

// console.log(
//   wtf('i was cool and [[cool]]')
//     .sentence()
//     .wikitext()
// )

console.log(wtf(txt).title())
