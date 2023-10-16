import wtf from './src/index.js'
console.log('start')

let str = `before {{Vgrtbl|NA|1989-03-12|EU|August 16, 2008}} after

`

let doc = wtf(str)
// const doc = await wtf.fetch('https://en.wikivoyage.org/wiki/Interstate_5')

console.log(doc.template().json())
console.log(doc.text())
