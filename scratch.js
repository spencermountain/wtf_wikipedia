import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)
// let doc = await wtf.fetch('Toronto Raptors')
// let coach = doc.infobox().get('coach')
// coach.text() //'Nick Nurse'

// let str = `The '''Byzantine Empire''' {{IPAc-en|z|{|n}} also referred to as the Eastern Roman Empire`
// let doc = wtf(str)
// console.log(doc.sentences()[0].text())

let str = `[[File:Jewish people around the world.svg|thumb|Map of the Jewish diaspora.<br />
more img|240x240px]]
foobar
`

// const file_reg = new RegExp('file:(.+?)[|\\]]', 'iu')
// console.log(str.match(file_reg))
let doc = wtf(str)
console.log(doc.sentence(0).text())
// console.log(doc.infoboxes().map(t => t.json()))

// wtf.fetch('Jewish diaspora').then((doc) => {
//   console.log(doc.sentence(0).text())
// })