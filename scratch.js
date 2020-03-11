// var wtf = require('./src/index')
var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/html/src'))

// wtf.extend((models, templates) => {
//   templates.one = 0
// })
wtf.fetch('Toronto').then(doc => {
  console.log(doc.html())
})
