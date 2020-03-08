var wtf = require('./src/index')

// wtf.extend((models, templates) => {
//   templates.foo = 0
// })
// ;(async () => {
//   var docs = await wtf.fetch(['Toronto', 'Montreal'], 'en')
//   console.log(docs.map(doc => doc.categories()))
// })()

wtf
  .fetch('USA', {
    lang: 'simple',
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  .then(doc => {
    console.log(doc.isRedirect())
  })
