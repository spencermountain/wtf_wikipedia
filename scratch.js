var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))

// Dirty: plugins-category

var str = `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]

  `
console.log(wtf(str).wikitext())
