const wtf = require('./src/index')
wtf.extend(require('./plugins/html/src'))

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   return pages.map((o) => o.title)
// }

// getAll(template).then((arr) => {
//   console.log(JSON.stringify(arr, null, 2))
// })

let doc = wtf('{{MILLENNIUM|1999}}')
console.log(doc.text())
// console.log(doc.templates())
