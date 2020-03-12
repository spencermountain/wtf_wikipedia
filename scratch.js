var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
// wtf.extend(require('./plugins/wikitext/src'))

// let txt = require('fs')
//   .readFileSync('/Users/spencer/mountain/wtf_wikipedia/tests/cache/royal_cinema.txt')
//   .toString()

// let str = `hello [[bs:cool]]`
// console.log(wtf(str).text())

wtf.fetch('Node.js').then(doc => {
  console.log(doc.images().map(i => i.url()))
})
