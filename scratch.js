var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/i18n/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

// wtf.fetch('Croatian language').then(doc => {
//   console.log(doc.tables().map(t => t.json()))
//   // let html = doc.html()
//   // console.log(html)
// })
let file = 'United-Kingdom'
let str = require('fs')
  .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
  .toString()

let doc = wtf(str)
console.log(JSON.stringify(doc.classify(), null, 2))
