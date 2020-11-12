const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   return pages.map((o) => o.title)
// }

// getAll(template).then((arr) => {
//   console.log(JSON.stringify(arr, null, 2))
// })

let str = `
Born in [[Basra]], he spent most of his productive period in the [[Fatimid Caliphate|Fatimid]] capital of [[Cairo]] and earned his living authoring various treatises and tutoring members of the nobilities.<ref>According to [[Al-Qifti]]. {{Harvnb|O'Connor|Robertson|1999}}.</ref>

Two in [[Basra]], he spent most of his productive period in the [[Fatimid Caliphate|Fatimid]] capital of [[Cairo]] and earned his living authoring various treatises and tutoring members of the nobilities.<ref>According to [[Al-Qifti]]. {{Harvnb|O'Connor|Robertson|1999}}.</ref>
`
let doc = wtf(str)
console.log(doc.paragraph(1))
// console.log(doc.infobox())
