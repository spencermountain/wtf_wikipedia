// require('pretty-exceptions')
const wtf = require('./src/index')
// const wtf = require('./builds/wtf_wikipedia.min')
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

wtf.extend((models, templates) => {
  templates.cool = (tmpl, r) => {
    r.templates.push({ yes: true })
    return 'hi'
  }
})
let str = `

==One==
asdfasdf

==Two==
also lkjasdlfkjdsf
`

let doc = wtf(`he is {{cool|true}}  {{fun|yep}}`)
// let doc = wtf(`he is [[cool|true]]  [[fun|yep]]`)
// let doc = wtf(str)
console.log(doc.templates())
// console.log(doc.templates())
