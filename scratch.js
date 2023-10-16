import wtf from './src/index.js'
console.log('start')

let str = `before {{lit|a|b}} after

`

let doc = wtf(str)
// const doc = await wtf.fetch('https://en.wikivoyage.org/wiki/Interstate_5')

// console.log(doc.template().json())
console.log(doc.text())
