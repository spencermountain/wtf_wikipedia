var wtf = require('./src/index')

// wtf.extend((models, templates) => {
//   templates.foo = 0
// })
;(async () => {
  var doc = await wtf.category('Category:Canadian_people_stubs')
  console.log(doc)
})()
