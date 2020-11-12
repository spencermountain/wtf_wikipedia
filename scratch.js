const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   return pages.map((o) => o.title)
// }

// getAll(template).then((arr) => {
//   console.log(JSON.stringify(arr, null, 2))
// })
// const str = `hello {{citation|url=cool.com/?fun=yes}} `
// const str = `{{Cita libru |url=cool.com |title= |last= |first= |date= |website= |publisher= |access-date= |quote=}}`
// const arr = wtf(str)
//   .references()
//   .map((c) => c.json())
// console.log(arr)

wtf.getCategoryPages('Swiss female skeleton racers').then((doc) => {
  console.log(doc)
})
