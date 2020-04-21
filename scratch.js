var wtf = require('./src/index')
wtf.extend(require('./plugins/wikitext/src'))

// Dirty: plugins-category

var str = `{| class="wikitable"
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
console.log(wtf(str).table().wikitext())
