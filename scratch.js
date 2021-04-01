const wtf = require('./src/index')
const test = require('tape')

// wtf.extend(require('./plugins/wikis/wikinews'))
// wtf.extend(require('./plugins/image/src'))

wtf.extend((models, templates) => {
  templates.cooltime = (text, doc, alias, parse) => {
    // console.log(text)
    // console.log(doc)
    console.log(parse)
    return
  }
})

let str = `{{cooltime|ohyeah}}`

let doc = wtf(str)
// console.log(doc.templates())
