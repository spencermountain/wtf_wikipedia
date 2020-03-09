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

wtf.fetch('Toronto', { lang: 'de', domain: 'wikivoyage.org' }).then(doc => {
  console.log(doc.sentences(0).text()) // ''
})
