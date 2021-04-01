const wtf = require('./src/index')
const test = require('tape')

// wtf.extend(require('./plugins/wikis/wikinews'))
// wtf.extend(require('./plugins/image/src'))

wtf.extend((models, templates) => {
  templates.cooltime = (text, data, c) => {
    console.log(text)
    console.log(data)
    return
  }
})

let str = `{{cooltime|ohyeah}}`

// let doc = wtf(str)
// console.log(doc.templates())
const p = wtf.fetch('Tony Hawk', 'fr')
p.then(function (doc) {
  console.log(doc.sentence().text())
})
