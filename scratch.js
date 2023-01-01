import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `  `
// missing



/*

{{convert|190|lb|kg|abbr=on}}

{{convert|1391|mm|in}}  -> output 'millimeters'? 



{{nihongo|'''Mikirō Sasaki'''|佐々木 幹郎|Sasaki Mikirō|October 20, 1947}} is a Japanese [[Poetry|poet]]


*[http://www.hydrodaten.admin.ch/en/2118.html#aktuelle_daten Waterlevels of Walensee] at Murg


{{div-col}}
* 2011: "Temple of Love" with Latexxx Teens
* 2012: "Kannst du mich seh'n" (Remix) for [[Staubkind]]
{{div-col-end}}

* {{look from|Big Trees}}
* {{in title|Big Tree}}
{{canned search|big-tree|big-trees}}




*/

// title='Limit of a sequence'
// title='Complex Wishart distribution'
// title='Asymmetric relation'
// title='John Beke'  //undefined?

// CBB schedule start  - gross template

// https://en.wikipedia.org/wiki/Template:MV

str = `'''Gunaroš''' ({{lang-sr-cyr|Гунарош}}, [[Hungarian language|Hungarian]]: ''Gunaras'') is a village `


str = `650 students drawn from a
community that has levels`

str = `# The return of the government's control of [[Idlib]],
# Transfer the management of the [[Reyhanlı]],
# Opening a commercial corridor ,`

str = `{{GTS|Infinity|2001}}`
str = `''The Telegraph''{{'}}s reviewer`


let doc = wtf(str)
console.log(doc.text())


// wtf.fetch(`Alice von Hildebrand`).then((doc) => {
//   console.log(doc.text())
// })