const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

const getBox = function (doc) {
  let box = doc.infobox('currency') //.json()
  let res = box.get(['iso_code', 'subunit_name_1', 'subunit_name_1', 'symbol', 'asdf']).map((s) => s.text())
  // let res = {
  //   title: doc.title(),
  //   iso: box.iso_code.text,
  //   subUnit: box.subunit_name_1.text,
  //   symbol: box.symbol.text,
  // }
  console.log(res)
  return res
}

// const getAll = async function (tmpl) {
//   let pages = await wtf.getTemplatePages(tmpl)
//   let docs = await wtf.fetchList(pages)
//   return docs.map(getBox)
// }
// console.log(getAll('Template:Infobox currency'))

// wtf.fetch('Brunei dollar').then((doc) => {
//   console.log(getBox(doc))
// })

let imgs = wtf(`{{Infoboks verksemd
  | namn = Statoil ASA
  | selskapsform = Allmenaksjeføretak
  | bilete =
  | skipa = [[18. september]] [[1972]]
  | eigar =
  | dotterselskap =
  | hovudkontor = {{NOR}} [[Stavanger]], [[Noreg]]
  | land =
  | bransje = Energi
  | produkt = Olje, gass og raffinerte produkt
  | styreleiar = [[Svein Rennemo]] (fungerande)
  | dagleg leiar =
  | direktør = [[Helge Lund]]
  | tilsette = 29&nbsp;500
  | tilsette år =
  | omsetnad = 650 mrd NOK<ref>[http://www.bors24.no/bors24.no2/site/stock/stock_detail.page?magic=(cc%20(subpage%20stock)%20(detail%20(tsid%2061873))) Børs24] Aksjekursen til StatoilHydro ved Oslo Børs</ref>
  | omsetnad år =
  | nettstad =www.statoil.com
  }}`).images()
console.log(imgs)
