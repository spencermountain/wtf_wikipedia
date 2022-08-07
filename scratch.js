import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)
// let doc = await wtf.fetch('Toronto Raptors')
// let coach = doc.infobox().get('coach')
// coach.text() //'Nick Nurse'

let str = `
foo ({{circa|4 BC}} AD 30 or 33 bar''
`
// let doc = wtf(str)
// console.log(doc.images())




// wtf.fetch('Jesus').then((doc) => {

//   console.log(doc.sentence(0).text())
// })
// str = ``
let doc = wtf(str)
console.log(doc.sentence(0).text())
// console.log(doc.infobox().json())



// console.log(doc.section('one').links())
// console.log(doc.templates('sustantivo masculino').map(t => t.json().template))
// console.log(doc.section('sustantivo masculino'))
// console.log(doc.json().sections)
// let f = doc.templates('sustantivo femenino')
// let m = doc.templates('sustantivo masculino')
// console.log(doc.text())

