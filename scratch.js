// var wtf = require('./src/index')
var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/markdown/src'))

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
var have = wtf('that cat is [[a]] cool dude')
  .sentences(0)
  .markdown()
console.log(have)
