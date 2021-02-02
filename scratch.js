const wtf = require('./src/index')
// wtf.extend(require('./plugins/wikis/wikinews'))
wtf.extend(require('./plugins/disambig/src'))

// * Love_in_Bloom
// * Love_Is_the_Law
// * Love_Affair
// * Loutit
// * Louis_II
// * Loughridge
// * Lothrop    -  https://en.m.wikipedia.org/wiki/Lothian_(disambiguation)#/editor/all

// wtf.fetch('Love_in_Bloom').then((doc) => {
//   console.log(doc.disambiguation())
// })

let str = `{{Infobox | subbox = yes
  | headerstyle = background-color:#ccc;
  | labelstyle = background-color:#ddd;
  | header1 = Sub 3-1
  | header2 = Sub 3-2
  |  label3 = Label 3-3 |   data3 = Data 3-3
 }}
`
// str = `causes [[food browning|browning]]`
// str = `[[2001 NBA Playoffs|2001]]`
let doc = wtf(str)
console.log(doc.infobox())
// doc.title('Lothian (disambiguation)')
// console.log(doc.link().json())

// wtf.fetch('Facebook').then((doc) => {
//   console.log(doc.infobox().image().json())
// })
