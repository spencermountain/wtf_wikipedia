var wtf = require('./src/index')
wtf.extend(require('./plugins/classify/src'))
wtf.extend(require('./plugins/i18n/src'))
wtf.extend(require('./plugins/summary/src'))
wtf.extend(require('./plugins/category/src'))

// let file = 'United-Kingdom'
// let str = require('fs')
//   .readFileSync(`/Users/spencer/mountain/wtf_wikipedia/tests/cache/${file}.txt`)
//   .toString()

// let doc = wtf(str)
// console.log(JSON.stringify(doc.sfw(), null, 2))
