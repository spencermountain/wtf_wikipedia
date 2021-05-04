const wtf = require('../../../src')
wtf.extend(require('./plugin'))

wtf
  .fetch('2007-03-14 - Air (Live PA) @ ABC Glasgow', {
    domain: 'www.mixesdb.com',
    path: 'db/api.php',
  })
  .then((doc) => {
    console.log(doc.wikitext())
    console.log(doc.templates().map((t) => t.json()))
    console.log(doc.list().json())
  })

// wtf.fetch('2016-06-04_-_J.Fernandes_@_FIL,_Lisbon', { domain: 'www.mixesdb.com', path: 'db/api.php' }).then((doc) => {
//   console.log(doc.template('player').json())
// })
