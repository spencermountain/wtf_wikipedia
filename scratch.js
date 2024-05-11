import wtf from './src/index.js'

let str = `
{{Birth date and age|df=y|1968|12|9}}
{{birthdate|1944|04|28|df=y}}
{{b-da|9 March 1958}}`

// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

let doc = wtf(str)
// const doc = await wtf.fetch('Philharmonie de Berlin', 'fr')
// console.log(doc.pageImage().json())
console.log(doc.text())
// console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
