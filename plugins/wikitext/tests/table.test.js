import test from 'tape'
import wtf from './_lib.js'

const tidy = (str) => {
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

  const have = wtf(str).table().makeWikitext()

  t.equal(tidy(have), tidy(str), 'with-header')

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

  const have = wtf(str).table().makeWikitext()

  t.equal(tidy(have), tidy(str), 'no-header')

  t.end()
})
