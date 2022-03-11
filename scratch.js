const wtf = require('./src/index')
// wtf.extend(require('./plugins/wikitext/src'))
wtf.extend(require('./plugins/html'))

let str = `hello
==== hello {{sustantivo}} ====
oh yeah
`

wtf.extend((_models, templates) => {
  templates['sustantivo'] = 'sustantivo'
})

let doc = wtf(str)
// console.log(doc.templates('sustantivo masculino').map(t => t.json().template))
// console.log(doc.section('sustantivo masculino'))
// console.log(doc.json().sections)
// let f = doc.templates('sustantivo femenino')
// let m = doc.templates('sustantivo masculino')
console.log(doc.json())