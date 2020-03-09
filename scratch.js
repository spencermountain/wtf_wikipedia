var wtf = require('./src/index')

wtf.extend((models, templates) => {
  templates.one = 0
  templates.two = 0
  templates.three = 0
  templates.four = 0
  templates.nest = 0
})
// ;(async () => {
//   var doc = await wtf('{{foo|asdf}}')
//   console.log(doc.templates())
//   console.log(doc.text())
// })()

// // article from chinese wikivoyage
// wtf.fetch('多伦多', { lang: 'zh', domain: 'wikivoyage.org' }).then(doc => {
//   console.log(doc.sentences(0).text()) // ''
// })
// wtf.fetch('On a Friday', 'en', function(err, doc) {
//   var val = doc.infobox(0).get('current_members');
//   val.links().map(link => link.page());
// });

// let str = `start {{nest|{{two|{{three|{{four|four}}}}}}}} end`
// let str = `start {{one| {{two|inside}}  }} {{one| asdf}} end`
let str = `<gallery widths="200px" heights="200px" caption="Nudes">
File:Freya (1901) by Anders Zorn.jpg|''[[Freyja|Freya]]'', 1901
File:ZORN på sandhamn.jpg|Woman bathing at Sandhamn, 1906
File:Anders Zorn I werners eka-1917.jpg|Woman in a boat, 1917
File:Anders Zorn - I Sängkammaren.jpg|''In the bedroom'', 1918
File:Anders Zorn - Ateljéidyll.jpg|G''Studio Idyll'', 1918
</gallery>`
let doc = wtf(str)

console.log(doc.templates())
// console.log(doc.templates())
// console.log(doc.data.sections[0].data.templates)
