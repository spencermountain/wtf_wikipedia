const wtf = require('../../../src')
wtf.extend(require('./plugin'))

wtf.fetch('https://species.wikimedia.org/wiki/Balistapus_undulatus').then((doc) => {
  console.log(doc.wikitext())
  console.log(doc.templates().map((t) => t.json()))
  console.log(doc.list().json())
})
