var test = require('tape')
var wtf = require('./_lib')
var tidy = (str) => {
  return str.trim()
}

test('table-header', (t) => {
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

  var have = wtf(str).table().markdown()
  var want = `
|    Header 1    |    Header 2    |    Header 3    |
|       ---      |       ---      |       ---      |
|  row 1, cell 1 |  row 1, cell 2 |  row 1, cell 3 |
|  row 2, cell 1 |  row 2, cell 2 |  row 2, cell 3 |
`
  t.equal(tidy(have), tidy(want), 'table-header')
  t.end()
})

test('no-header', (t) => {
  var str = `{| class="wikitable"
|-
| row 1, cell 1
| row 1, cell 2
| row 1, cell 3
|-
| row 2, cell 1
| row 2, cell 2
| row 2, cell 3
|}`

  var have = wtf(str).table().markdown()
  var want = `
|                |                |                |
|       ---      |       ---      |       ---      |
|  row 1, cell 1 |  row 1, cell 2 |  row 1, cell 3 |
|  row 2, cell 1 |  row 2, cell 2 |  row 2, cell 3 |
`
  t.equal(tidy(have), tidy(want), 'no-header')
  t.end()
})
