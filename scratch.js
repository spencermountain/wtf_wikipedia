var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

// wtf.fetch('Template:2019–20 coronavirus pandemic data/United States/California medical cases chart').then((doc) => {
//   console.log(doc.template('medical cases chart'))
// })

// let doc = wtf(`[[US]]99`)
// console.log(doc.links(0).json())
// console.log(doc.text())

// wtf.fetch('Toronto Raptors').then((doc) => {
//   console.log(doc.title())
//   console.log(doc.pageID())
//   console.log(doc.wikidata())
//   // console.log(doc.)
// })

wtf.random().then((doc) => {
  console.log(doc.wikidata())
})
