// var wtf = require('./src/index')
var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/html/src'))

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
var have = wtf('that cat is [[a]] cool dude')
  .sentences(0)
  .html()
console.log(have)
