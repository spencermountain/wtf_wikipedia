import wtf from './src/index.js'

let str = `hello
==== hello {{foobar}} ====
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