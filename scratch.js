var wtf = require('./src/index')
// var wtf = require('./builds/wtf_wikipedia')
wtf.extend(require('./plugins/category/src'))

// Dirty: plugins-category

console.log(wtf('[[fun]] cool nice ').text())
