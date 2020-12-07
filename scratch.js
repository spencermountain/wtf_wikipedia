const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

const getBox = function (doc) {
  let box = doc.infobox('currency') //.json()
  let res = box.get(['iso_code', 'subunit_name_1', 'symbol']).map((s) => s.text())
  return {
    title: doc.title(),
    iso: res[0],
    subUnit: res[1],
    symbol: res[2],
  }
}

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   let docs = await wtf.fetchList(pages)
//   return docs.map(getBox)
// }
// console.log(JSON.stringify(getAll('Template:Infobox currency'), null, 2))

// wtf.fetch('Brunei dollar').then((doc) => {
//   console.log(getBox(doc))
// })

// wtf.fetch('https://wiki.openstreetmap.org/wiki/Tag:highway%3Dmotorway', { path: '/w/api.php' }).then((doc) => {
wtf.fetch('https://wiki.openstreetmap.org/wiki/Tag:highway%3Dmotorway').then((doc) => {
  console.log(doc.templates('ValueDescription'))
})
