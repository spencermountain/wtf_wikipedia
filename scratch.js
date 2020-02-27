// require('pretty-exceptions')
const wtf = require('./src/index')
// const wtf = require('./builds/wtf_wikipedia.min')
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

wtf.extend((models, templates) => {
  templates.foo = ['a', 'b', 'c']
})

let doc = wtf(`known as '''J. J. Abrams'''`)
console.log(doc.sentences(0).text())
// console.log(doc.text())
