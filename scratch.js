import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `  `
/*

{{convert|190|lb|kg|abbr=on}}

{{convert|1391|mm|in}}  -> output 'millimeters'? 

{{nihongo|'''Mikirō Sasaki'''|佐々木 幹郎|Sasaki Mikirō|October 20, 1947}} is a Japanese [[Poetry|poet]]

*[http://www.hydrodaten.admin.ch/en/2118.html#aktuelle_daten Waterlevels of Walensee] at Murg



*/

// title='Limit of a sequence'
// title='Complex Wishart distribution'
// title='Asymmetric relation'
// title='John Beke'  //undefined?

// CBB schedule start  - gross template

// https://en.wikipedia.org/wiki/Template:MV

str = `{{GTS|Infinity|2001}}`


str = `'''Gunaroš''' ({{lang-sr-cyr|Гунарош}}, [[Hungarian language|Hungarian]]: ''Gunaras'') is a village `


let doc = wtf(str)
console.log(doc.text())


// wtf.fetch(`Alice von Hildebrand`).then((doc) => {
//   console.log(doc.text())
// })