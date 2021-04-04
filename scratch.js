const wtf = require('./src/index')
wtf.extend(require('./plugins/wikis/wiktionary/plugin'))

// one
// let str = `[[one]] and [[two]]`
// let doc = wtf(str)
// console.log(doc.links(0))

// two
let str = `{| class="wikitable"
|-
! Header 1
! Header 2
! Header 3
|-
| row 1, cell 1
| row 1, cell 2
| row 1, cell 3
|-
| row 2, cell 1
| row 2, cell 2
| row 2, cell 3
|}`
let doc = wtf(str)
console.log(doc.table().get(['header 2', 'asdf', 'Header 1']))
// console.log(doc.table().json())
