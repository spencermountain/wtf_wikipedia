var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

// wtf.fetch('Template:2019–20 coronavirus pandemic data/United States/California medical cases chart').then((doc) => {
//   console.log(doc.template('medical cases chart'))
// })

let doc = wtf(`hi <sub>world</sub> there`)
console.log(doc.sentence(0).json())
console.log(doc.text())

// wtf.fetch('Quartz', 'en').then((doc) => {
//   // console.log(doc.lang())
//   console.log(doc.images().map((j) => j.url()))
// })
