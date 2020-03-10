const wtf = require('wtf_wikipedia')
wtf.extend(require(`./src`))

let doc = wtf('cool [[stuff]] **bold** too')
console.log(doc.html())
