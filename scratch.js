var wtf = require('./src/index')

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
wtf.fetch('2016-06-04_-_J.Fernandes_@_FIL,_Lisbon', { domain: 'www.mixesdb.com', path: 'db/api.php' }).then(doc => {
  console.log(doc.templates('player'))
})
