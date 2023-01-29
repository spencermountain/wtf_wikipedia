import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `  `
/*

{{convert|190|lb|kg|abbr=on}}
{{convert|1391|mm|in}}  -> output 'millimeters'? 



*/


// str = `{{nihongo|'''Mikirō Sasaki'''|佐々木 幹郎|Sasaki Mikirō|October 20, 1947}} is a Japanese [[Poetry|poet]]`
// let doc = wtf(str)
// console.log(doc.text())


wtf.fetch(`https://en.wikipedia.org/wiki/Mick_Fuller`).then((doc) => {
  console.log(doc.text())
})