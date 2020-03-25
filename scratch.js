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

// wtf.fetchCategory('Larchmont, New York').then(res => {
//   res.docs.forEach(doc => {
//     console.log(doc.title())
//     console.log(doc.summary())
//     console.log('\n\n')
//   })
// })
// let str =
//   'Larchmont Yacht Club is a private, members-only yacht club situated on Larchmont Harbor in the Village of Larchmont, in Westchester County, New York. '
// console.log(wtf(str).summary())

// let file = 'United-Kingdom'
// let txt = require('fs')
//   .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//   .toString()
// let doc = wtf(txt)
// let res = doc.classify()
// console.log(res)
