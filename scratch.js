const wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))

// one
// let str = `[[one]] and [[two]]`
// let doc = wtf(str)
// console.log(doc.links(0))
// two

// // console.log(doc.table().json())

// let doc = wtf.fetch('Milwaukee Bucks').then((doc) => {
// console.log(doc.sentence(133))
// console.log(doc.sentence(133).json())
// })

let str = `{{foobar | fun = true | key = val}}`
// str = `{{hello|world}}
// str = `Emery is a vegetarian,<ref>{{cite web|title=The princess of pot|url=http://thewalrus.ca/the-princess-of-pot/}}</ref>`

// `
let doc = wtf(str)
// console.log(doc.links(0).map((t) => t.text()))
// console.log(doc.reference().json())
console.log(doc.makeWikitext())
// console.log(doc.template())

// let doc = wtf(`* {{USS|Barry}}, four US destroyers`)
// let tmpl = doc.template()
// console.log(tmpl.wikitext())
// console.log(tmpl.text())
// console.log(doc.text())
