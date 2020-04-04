var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/classify/src'))
// wtf.extend(require('./plugins/i18n/src'))
// wtf.extend(require('./plugins/summary/src'))
// wtf.extend(require('./plugins/category/src'))

wtf.fetch('You Shall Know Our Velocity').then((doc) => {
  console.log(doc.classify().detail)
})
