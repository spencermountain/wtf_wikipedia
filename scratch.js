var wtf = require('./src/index')

wtf.extend((models, templates) => {
  templates.foo = 0
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

let str = `{{nest|{{nest|{{nest|{{nest|four}}}}}}}}`
console.log(
  wtf(str)
    .text()
    .trim()
)
