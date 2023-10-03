import wtf from './src/index.js'
console.log('start')

let str = `hello
{{usableitinerary}}
`
// let doc = wtf(str)
const doc = await wtf.fetch('https://en.wikivoyage.org/wiki/Interstate_5')

console.log(doc.text())
