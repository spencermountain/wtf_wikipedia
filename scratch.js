var wtf = require('./src/index')

wtf.extend((models, templates) => {
  templates.one = 0
  templates.two = 0
  templates.three = 0
  templates.four = 0
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
// let str = `start {{nest| {{two|inside}}  }} end`
let str = `start {{cool|oh|yeah}}  }} end`
let doc = wtf(str)

console.log(doc.templates())
// console.log(doc.data.sections[0].data.templates)
