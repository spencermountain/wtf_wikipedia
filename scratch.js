import wtf from './src/index.js'

let str = `
<ref>{{cite book |last= Bushnell|first= Ian}}
 {{cite book |last= Walker|first= James W. St. G.}}</ref>

`

let doc = wtf(str)
// const doc = await wtf.fetch('Grand Bend')

// console.log(doc.template().json())
console.log(doc.references().map((r) => r.json()))
