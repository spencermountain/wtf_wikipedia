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

let str = `
* one is cool. so it is.
* two
** three
** four
`
// str = `causes [[food browning|browning]]`
// str = `[[2001 NBA Playoffs|2001]]`
// let doc = wtf(str)
// doc.title('Lothian (disambiguation)')
// console.log(doc.link().json())

wtf.fetch('Facebook').then((doc) => {
  console.log(doc.infobox().image().json())
})
