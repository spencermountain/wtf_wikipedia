const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

const getBox = function (doc) {
  let box = doc.infobox('currency') //.json()
  let res = box.get(['iso_code', 'subunit_name_1'])
  // let res = {
  //   title: doc.title(),
  //   iso: box.iso_code.text,
  //   subUnit: box.subunit_name_1.text,
  //   symbol: box.symbol.text,
  // }
  console.log(res)
  return res
}

const getAll = async function (tmpl) {
  let pages = await wtf.getTemplatePages(tmpl)
  let docs = await wtf.fetchList(pages)
  return docs.map(getBox)
}
// console.log(getAll('Template:Infobox currency'))

wtf.fetch('Brunei dollar').then((doc) => {
  console.log(getBox(doc))
})
