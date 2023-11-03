import wtf from './src/index.js'

let str = `
<ref name="cool">{{cite book |last= Bushnell|first= Ian}}
 {{cite book |last= Walker|first= James W. St. G.}}</ref>

`

// str = `<ref>{{GEOnet3|-3087388|Teymanak-e Olya}}</ref> is a village in [[Jolgeh-ye Musaabad Rural District]],`

let doc = wtf(str)
// const doc = await wtf.fetch('Grand Bend')

// console.log(doc.template().json())
console.log(doc.references().map((r) => r.json()))
