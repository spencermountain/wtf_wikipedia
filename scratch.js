import wtf from './src/index.js'

let str = ``

str = `{[vec|...}}`
str = `{{font color|...}}`
str = `{{color|...}}`
str = `{{pars|...}}`
str = `{{nuclide|...}}`
str = `{{Subatomic Particle|...}}`
str = `{{music|...}}`
str = `{{thinspace|...}}`
str = `{{#if|....}}`
str = `{{gap|...}}`
str = `{{su|...}}`
str = `{{SubSup|...}}`
str = `{{normal|text-string}}`
str = `{{pp.|2|sq.}}`

// str = `{{Φ}}`

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
