import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)

// let str = `{{float |top=2.0em |left=2px |width=10em | the content to float}}.`
// let str = `{{splitspan|foo|bar}}`
// let str = `  {{font|text=也可以只選用其中一項選項。|size=25px}}  `
// let doc = wtf(str)
// console.log(doc.text())


let str = ` {{Infobox officeholder
  | name                = Dr. Rajesh Sonkar
  | office              = [[President Bhartiya Janta Party(BJP) Indore, Madhya Pradesh]]
  | term_start          = 10 May 2020
  | Office              =
  }}`
let doc = wtf(str)
console.log(doc.infobox().json())


// wtf.fetch("Formula One drivers from Finland", "en")
// trunc
// wtf.fetch("2007 FIFA Women's World Cup Group A", "en")

// fails on percentage template
// wtf.fetch("Sacramento Mountain Lions", "es")

// fails on min template
// wtf.fetch("Phase finale du Championnat du monde masculin de handball 2019", "fr")
