import wtf from './src/index.js'

let str = `hello
{{DECADE|1915}}

`

let doc = wtf(str)
// console.log(doc.templates('sustantivo masculino').map(t => t.json().template))
// console.log(doc.section('sustantivo masculino'))
// console.log(doc.json().sections)
// let f = doc.templates('sustantivo femenino')
// let m = doc.templates('sustantivo masculino')
console.log(doc.text())