import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)
// let doc = await wtf.fetch('Toronto Raptors')
// let coach = doc.infobox().get('coach')
// coach.text() //'Nick Nurse'

// let str = `The '''Byzantine Empire''' {{IPAc-en|z|{|n}} also referred to as the Eastern Roman Empire`
// let doc = wtf(str)
// console.log(doc.sentences()[0].text())

let str = `
{{Картка:Лідер
| оригінал імені    = foo
| жінка             = bar
}}`
let doc = wtf(str)
console.log(doc.infoboxes().map(t => t.json()))
