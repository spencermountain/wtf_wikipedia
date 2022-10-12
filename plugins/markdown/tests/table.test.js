import test from 'tape'
import wtf from './_lib.js'

function tidy (str) {
  return str.trim()
}

test('table-header', (t) => {
  const str = `{| class="wikitable"
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

  const have = wtf(str).table().markdown()
  const want = `
|    Header 1    |    Header 2    |    Header 3    |
|       ---      |       ---      |       ---      |
|  row 1, cell 1 |  row 1, cell 2 |  row 1, cell 3 |
|  row 2, cell 1 |  row 2, cell 2 |  row 2, cell 3 |
`
  t.equal(tidy(have), tidy(want), 'table-header')
  t.end()
})

test('no-header', (t) => {
  const str = `{| class="wikitable"
|-
| row 1, cell 1
| row 1, cell 2
| row 1, cell 3
|-
| row 2, cell 1
| row 2, cell 2
| row 2, cell 3
|}`

  const have = wtf(str).table().markdown()
  const want = `
|                |                |                |
|       ---      |       ---      |       ---      |
|  row 1, cell 1 |  row 1, cell 2 |  row 1, cell 3 |
|  row 2, cell 1 |  row 2, cell 2 |  row 2, cell 3 |
`
  t.equal(tidy(have), tidy(want), 'no-header')
  t.end()
})
