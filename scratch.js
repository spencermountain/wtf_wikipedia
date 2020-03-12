var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/html/src'))

// let txt = require('fs')
//   .readFileSync('/Users/spencer/mountain/wtf_wikipedia/tests/cache/royal_cinema.txt')
//   .toString()

// let str = `hello [[bs:cool]]`
// console.log(wtf(str).text())

// let str = `majority of [[music]], [[film]]s, [[book]]s`
// let doc = wtf(str)
// console.log(doc.links().map(l => l.json()))

// let str = `infront {{math| missing {{=}} text}} behind`
// let doc = wtf(str)
// console.log(doc.text())
// infront behind

wtf
  .fetch('casa', 'it', {
    wiki: `wiktionary`
  })
  .then(function(doc) {
    console.log(doc.images().map(img => img.json()))
  })
