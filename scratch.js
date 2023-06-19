import wtf from './src/index.js'
import plg from './plugins/i18n/src/index.js'
wtf.plugin(plg)

let str = `#AANSTUUR[[Xai-Xai]]
`
// let str = `  {{font|text=也可以只選用其中一項選項。|size=25px}}  `
let doc = wtf(str)
console.log(doc.text())
// doc.templates().map((s) => s.json())
// console.log(doc.templates()[4].json())


// let doc = await wtf.fetch("Space_disco", "it")
// console.log(doc.text())
// trunc
// wtf.fetch("2007 FIFA Women's World Cup Group A", "en")

// fails on percentage template
// wtf.fetch("Sacramento Mountain Lions", "es")

// fails on min template
// wtf.fetch("Phase finale du Championnat du monde masculin de handball 2019", "fr")
