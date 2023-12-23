import wtf from './src/index.js'

let str = `
<ref name="cool">{{cite book |last= Bushnell|first= Ian}}
 {{cite book |last= Walker|first= James W. St. G.}}</ref>

`

str = `<ref> Chapman {{Foo}} </ref> `
// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

// let doc = wtf(str)
const doc = await wtf.fetch('Tony Hawk')
// console.log(doc.json())
console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
