var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/image/src'))

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

let str = `<gallery>
File:Liverpool Road.jpg|<small>[[Manchester]]: [[Manchester Liverpool Road railway station|''Liverpool & Manchester Railway'' station]] (1830).</small>
File:Stazione Napoli-Portici (Lucioni).jpg|<small>[[Naples]]: Stazione Bayard (right, 1839) and Regia (left, 1843).</small>
File:Nicolas-Marie-Joseph Chapuy 001.jpg|<small>[[Vienna]]: twin stations Staatsbahnhof (left) and Gloggnitzer Bahnhof (right) from the early 1840s.</small>
File:MannheimBahnhof1840.jpg|<small>[[Mannheim]]: the first station building and train shed (1840).</small>
</gallery>`

console.log(
  wtf(str)
    .images()
    .map(i => i.json())
)
