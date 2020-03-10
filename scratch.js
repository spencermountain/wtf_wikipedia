var wtf = require('./src/index')

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
// ;(async () => {
//   var doc = await wtf.fetch('Template:2019–20 coronavirus outbreak data/WHO situation reports')
//   let json = doc.tables().map(table => {
//     return table.json()
//   })
//   console.log(json[0])
// })()

// // article from chinese wikivoyage
// wtf.fetch('多伦多', { lang: 'zh', domain: 'wikivoyage.org' }).then(doc => {
//   console.log(doc.sentences(0).text()) // ''
// })
wtf.fetch('On a Friday', 'en', function(err, doc) {
  var val = doc.infobox(0).get('current members')
  // let links = val.links().map(link => link.page())
  console.log(val.text())
})

// let str = `start {{nest|{{two|{{three|{{four|four}}}}}}}} end`
// let str = `start {{one| {{two|inside}}  }} {{one| asdf}} end`
// let str = `
// {{Columns-list|
// *[[Capacity to be alone]]
// *''[[Écriture féminine]]''
// *[[Khôra]]
// *[[List of thinkers influenced by deconstruction]]
// }}`
// let doc = wtf(str)

// console.log(doc.templates())
// console.log(doc.templates())
// console.log(doc.data.sections[0].data.templates)
