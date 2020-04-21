var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))

// Dirty: plugins-category

var str = `{{foobar|fun=true|key=val}}
`
console.log(wtf(str).wikitext())
