import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)

let str
str = `[[s:Administrative Order 9|cool]]`
// str = `[[d:Administrative]] is [[cool]]`
// str = `[[s:de:Hauptseite]]`
// str = `[[fr:cool]]`
let doc = wtf(str)
let json = doc.links().map(l => l.json())
console.log(json)

// wtf.fetch('December_1').then((doc) => {
// })