var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
// wtf.extend(require('./plugins/i18n/src'))
// wtf.extend(require('./plugins/summary/src'))
// wtf.extend(require('./plugins/category/src'))

// Alexis Korner
// Arnold Schwarzenegger
// Alf Tales
// André the Giant
// Arbroath Abbey
// Australian Broadcasting Corporation
wtf.fetch('Andrew S. Tanenbaum').then((doc) => {
  console.log(doc.classify())
})
