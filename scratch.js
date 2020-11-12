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
`
// let doc = wtf(str)
// console.log(doc.infobox(0))

let doc = wtf('', { title: 'Barack Obama' })
console.log(doc.url())
