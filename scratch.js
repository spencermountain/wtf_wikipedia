import wtf from './src/index.js'
import plg from './plugins/html/src/index.js'
wtf.plugin(plg)

let str = `  `
/*

{{convert|190|lb|kg|abbr=on}}
{{convert|1391|mm|in}}  -> output 'millimeters'? 



*/


// str = `{{nihongo|'''Mikirō Sasaki'''|佐々木 幹郎|Sasaki Mikirō|October 20, 1947}} is a Japanese [[Poetry|poet]]`
str = `{{Infobox officeholder
  | name               = Romina Pérez
  | president1         = [[Evo Morales]]
  | term_start1        = 3 June 2019
  | term_end1          = 15 November 2019
  | predecessor1       = Walter Yañez{{efn-lg|As [[chargé d'affaires]].}}
  | successor1         = Position dissolved
  | office2            = {{Br list|Member of the [[Chamber of Deputies (Bolivia)|Chamber of Deputies]]|from [[Cochabamba Department|Cochabamba]]}}
}}`
let doc = wtf(str)
console.log(doc.infobox().json())
// console.log(doc.text())

// wtf.fetch(`https://en.wikipedia.org/wiki/Mick_Fuller`).then((doc) => {
//   console.log(doc.text())
// })