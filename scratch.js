import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)

// let str = `{{float |top=2.0em |left=2px |width=10em | the content to float}}.`
// let str = `{{splitspan|foo|bar}}`
// let str = `  {{font|text=也可以只選用其中一項選項。|size=25px}}  `
// let doc = wtf(str)
// console.log(doc.text())


let str = `
  {{Collapsible list
    | title = {{resize|1.25em|United Kingdom of Great<br/> Britain and Northern Ireland}}
    | [[Iceland]]
    | [[Liechtenstein]]
    | [[Norway]]
    | [[Switzerland]]
   }}

`
let doc = wtf(str)
console.log(doc.templates().map((s) => JSON.stringify(s.json()).length)[4])
console.log(doc.templates().map((s) => JSON.stringify(s.json()))[4])
console.log(doc.text())
// doc.templates().map((s) => s.json())
// console.log(doc.templates()[4].json())


// wtf.fetch("Formula One drivers from Finland", "en")
// trunc
// wtf.fetch("2007 FIFA Women's World Cup Group A", "en")

// fails on percentage template
// wtf.fetch("Sacramento Mountain Lions", "es")

// fails on min template
// wtf.fetch("Phase finale du Championnat du monde masculin de handball 2019", "fr")
