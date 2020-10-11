var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))
// wtf.extend(require('./plugins/i18n/src'))

// var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`
// console.log(wtf(str).json())

// wtf.fetch('Quartz', 'en').then((doc) => {
//   // console.log(doc.lang())
//   console.log(doc.images().map((j) => j.url()))
// })

let str = `
<ref name="Bond">{{cite magazine |last=Bond |first=Brian |date=October 1963 |title=Amritsar 1919 |magazine=History Today |volume=13 |uitgawe=10 |bls.=666–676}}</ref>
`
let doc = wtf(str)
let json = doc.json({encode: true}).sections[0].references
console.log(json)
console.log(doc.infobox().image().url())
// console.log(doc.images().map((img) => img.url()))
