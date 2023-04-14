import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)

// let str = ` `
// let doc = wtf(str)
// console.log(doc.json())

// wtf.fetch("Formula One drivers from Finland", "en")
// trunc
// wtf.fetch("2007 FIFA Women's World Cup Group A", "en")

// fails on percentage template
// wtf.fetch("Sacramento Mountain Lions", "es")

// fails on min template
wtf.fetch("Phase finale du Championnat du monde masculin de handball 2019", "fr")