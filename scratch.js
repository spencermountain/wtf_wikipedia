const wtf = require('./src/index')
// wtf.extend(require('./plugins/wikitext/src'))
wtf.extend(require('./plugins/html'))

// one
// let str = `[[one]] and [[two]] {{one}} and {{two}}`
// let doc = wtf(str)
// console.log(doc.templates(1)[0].json())

// let str = `{{Infobox country
// | common_name = United Kingdom
// }}
// `
// let obj = wtf(str).infobox(0).json()
// console.log(obj)

// wtf.fetch('https://tvtropes.org/pmwiki/pmwiki.php/Main/Japandering').then((doc) => {
//   console.log(doc)
// })
// const wtf = require('wtf_wikipedia')
// wtf.extend(require('wtf-plugin-html'))

const input = "'''some bold text''' yeah"
let doc = wtf(input, { pageID: 'foo' })
// doc._wiki = 'foo'
console.log(doc.pageID())
