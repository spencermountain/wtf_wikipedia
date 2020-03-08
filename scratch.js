var wtf = require('./src/index')

// wtf.extend((models, templates) => {
//   templates.foo = 0
// })
// ;(async () => {
//   // var docs = await wtf.fetch(['Toronto', 'Montreal'], 'en')
//   var docs = await wtf.fetch([2983, 7493], 'en')
//   console.log(docs.map(doc => doc.categories()))
// })()

var p = wtf.fetch(336711, 'en', {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  domain: 'www.mixesdb.com',
  path: 'db/api.php'
})
p.then(function(doc) {
  console.log(doc.title())
})
