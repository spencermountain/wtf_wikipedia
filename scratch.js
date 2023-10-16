import wtf from './src/index.js'
console.log('start')

let str = `before {{vgrelease|NA|September 29, 1999|EU|October 18, 1999}} after

`

wtf.extend((models, templates) => {
  templates.vgrelease = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4']
})
let doc = wtf(str)
// const doc = await wtf.fetch('https://en.wikivoyage.org/wiki/Interstate_5')

console.log(doc.template().json())
console.log(doc.text())
