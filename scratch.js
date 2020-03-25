var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/i18n/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

// wtf.fetch('Toronto').then(doc => {
//   let html = doc.html()
//   console.log(html)
// })

let str = `CoolToday Park is a planned ballpark in North Port, Florida.`
console.log(wtf(str).tense())
console.log(wtf(str).article())

// let file = 'United-Kingdom'
// let txt = require('fs')
//   .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//   .toString()
// let doc = wtf(txt)
// let res = doc.classify()
// console.log(res)
