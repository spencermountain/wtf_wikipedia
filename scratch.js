const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

const template = 'Template:Infobox medical condition (new)'

const getTemplates = async function (tmpl) {
  let pages = await wtf.getTemplatePages(tmpl)
  return pages.map((o) => o.title)
}

getTemplates(template).then((arr) => {
  console.log(JSON.stringify(arr, null, 2))
})
