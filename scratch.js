var wtf = require('./src/index')

wtf.extend((models, templates) => {
  templates.foo = 0
})
;(async () => {
  var doc = await wtf('{{foo|asdf}}')
  console.log(doc.templates())
  console.log(doc.text())
})()
