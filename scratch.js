const wtf = require('./src/index')
wtf.extend(require('./plugins/disambig/src'))

let str = `'''Barry''' may refer to:
{{TOC right}}

* [[Barry (UK Parliament constituency)]]
* [[Barry University]], a private Catholic university in Miami Shores, Florida
* [[Tropical Storm Barry]]
* {{USS|Barry}}, four US destroyers
* [[1703 Barry]], a minor planet

{{srt}}

{{Disambiguation|geo}}`

// let doc = wtf(str)
// console.log(doc._wiki)
// console.log(doc.templates())
// console.log(doc.isDisambiguation())
// console.log(doc.disambiguation())
// console.log(doc.link(3).json())

let doc = wtf(`[[cool|fun ''times'']]`)
console.log(doc.link().text())
