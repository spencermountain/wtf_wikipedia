const wtf = require('./src/index')
wtf.extend(require('./plugins/wikis/wiktionary/plugin'))

// one
let str = `[[one]] and [[two]]`
let doc = wtf(str)
// console.log(doc.links(0))
console.log(doc.sentence().wikitext())

// two

// // console.log(doc.table().json())

// let doc = wtf.fetch('Milwaukee Bucks').then((doc) => {
// console.log(doc.sentence(133))
// console.log(doc.sentence(133).json())
// })
