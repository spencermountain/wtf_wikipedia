import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)
// let doc = await wtf.fetch('Toronto Raptors')
// let coach = doc.infobox().get('coach')
// coach.text() //'Nick Nurse'

const str = `'''22''' may refer to:
* [[22 (number)]]
* [[22 BC]]
* [[AD 22]]
* [[1922]]
* [[2022]]
`
// const doc = await wtf.fetch('https://en.wikipedia.org/wiki/22')
let doc = wtf(str)
console.log(doc.isDisambig())
// console.log(doc.templates('sustantivo masculino').map(t => t.json().template))
// console.log(doc.section('sustantivo masculino'))
// console.log(doc.json().sections)
// let f = doc.templates('sustantivo femenino')
// let m = doc.templates('sustantivo masculino')
// console.log(doc.text())