const wtf = require('./src/index')
wtf.extend(require('./plugins/html/src'))

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   return pages.map((o) => o.title)
// }

// getAll(template).then((arr) => {
//   console.log(JSON.stringify(arr, null, 2))
// })

let str = `
<div style="text-align:center;">inside div</div>
`
console.log(wtf(str).section(0).text())
