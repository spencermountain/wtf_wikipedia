const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

wtf.fetch('Toronto Raptors', 'en').then((doc) => {
  doc.pageViews().then((res) => {
    console.log(res)
    console.log('done')
  })
  // console.log(doc.lang())
  // console.log(doc.images().map((j) => j.url()))
})

// wtf.random().then((doc) => {
//   console.log(doc.title(), doc.categories())
// })
