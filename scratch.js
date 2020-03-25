var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

/*
 * interwiki links
 * disambiguation templates
// {{Place name disambiguation}}
// {{Airport disambiguation}}

 */

// wtf.fetch('Toronto').then(doc => {
//   let html = doc.html()
//   console.log(html)
// })
// let str = `CoolToday Park is a ballpark in North Port, Florida, located in the southern portion of Sarasota County, 35 miles south of Sarasota, Florida.`
// console.log(wtf(str).summary())

// let str = `[[fr:cool]]`
// let doc = wtf(str)
// console.log(doc.link().href())

let file = 'United-Kingdom'

let txt = require('fs')
  .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
  .toString()
let doc = wtf(txt)
let res = doc.classify()
console.log(res)
