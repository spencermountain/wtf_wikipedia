const wtf = require('./src/index')
const test = require('tape')

// wtf.extend(require('./plugins/wikis/wikinews'))
wtf.extend(require('./plugins/image/src'))

wtf.fetch('casa', 'it').then(function (doc) {
  console.log(doc)
})
