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
str = `{{multiply|4|5}}`
str = '{{Hexadecimal|15|hex}}'
str = '{{hex2dec|0x7C0}}'
// str = `{{Rounddown|3.14159|3}}`

// str = `{{SubSup|a|b|C}}`
// str = `For example, fact {{r|RefName|p=22}}`

// str = `before
// :indent
// after`

// str = `hello
// : first
// :: second
// world`

// console.log(wtf('This is an\n:before\nafter').text())

// str = `{{Φ}}`

// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

let doc = wtf(str)
console.log(doc.text())
// console.log(doc.json().sections[0])
// const doc = await wtf.fetch('Philharmonie de Berlin', 'fr')
// console.log(doc.pageImage().json())
// console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
