import wtf from './src/index.js'

let str = `
<ref name="cool">{{cite book |last= Bushnell|first= Ian}}
 {{cite book |last= Walker|first= James W. St. G.}}</ref>

`

str = `<ref> Chapman {{Foo}} </ref> `
// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

wtf.extend((models, templates) => {
  templates.egiptekas = '{|-\n'
})
// let doc = wtf(str)
const doc = await wtf.fetch('3de Dinastie van Egipte', 'af')
// console.log(doc.json())
console.log(doc.text())
// console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
