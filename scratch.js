const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

// const template = 'Template:Infobox medical condition (new)'
const template = 'Toronto'

const getAll = async function (tmpl) {
  let pages = await wtf.getRedirects(tmpl)
  return pages.map((o) => o.title)
}

getAll(template).then((arr) => {
  console.log(JSON.stringify(arr, null, 2))
})
