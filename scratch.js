var wtf = require('./src/index')

// wtf.extend((models, templates) => {
//   templates.foo = 0
// })
;(async () => {
  var doc = await wtf.fetch('Billy_Steele', 'en')
  console.log(doc.text())
})()
