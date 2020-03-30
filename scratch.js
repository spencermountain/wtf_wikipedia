var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/i18n/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))
wtf.extend(require('./plugins/sfw/src'))

wtf.fetch('Jeffrey Dahmer').then(doc => {
  // console.log(doc.tables().map(t => t.json()))
  // let html = doc.html()
  console.log(doc.sfw())
})
// let file = 'United-Kingdom'
// let str = require('fs')
//   .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//   .toString()

// let doc = wtf(str)
// console.log(JSON.stringify(doc.sfw(), null, 2))

// wtf.category('Psychoactive drugs').then(res => {
//   let arr = res.categories.map(o => o.title.toLowerCase().replace(/(template|category):/, ''))
//   let obj = {}
//   arr.forEach(str => {
//     obj[str] = 'Drug-use'
//   })
//   console.log(obj)
// })
