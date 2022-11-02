import test from 'tape'
import wtf from './_lib.js'

function tidy (str) {
  str = str.replace(/\s{2,}/g, ' ')
  str = str.replace(/\n/g, '')
  str = str.replace(/ >/g, '>')
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

  const have = wtf(str).table().html()
  const want = `
  <table class="table">
  <thead>
  <tr>
    <td>Header 1</td>
    <td>Header 2</td>
    <td>Header 3</td>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><span class="sentence">row 1, cell 1</span></td>
    <td><span class="sentence">row 1, cell 2</span></td>
    <td><span class="sentence">row 1, cell 3</span></td>
  </tr>
  <tr>
    <td><span class="sentence">row 2, cell 1</span></td>
    <td><span class="sentence">row 2, cell 2</span></td>
    <td><span class="sentence">row 2, cell 3</span></td>
  </tr>
  </tbody>
</table>
`
  t.equal(tidy(have), tidy(want), 'with-header')

  t.end()
})

test('no-header', (t) => {
  const str = `{| class="wikitable"
|-
| row 1, cell 1
| row 1, cell 2
|-
| row 2, cell 1
| row 2, cell 2
|}`

  const have = wtf(str).table().html()
  const want = `
  <table class="table">
  <thead>
  <tr>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><span class="sentence">row 1, cell 1</span></td>
    <td><span class="sentence">row 1, cell 2</span></td>
  </tr>
  <tr>
    <td><span class="sentence">row 2, cell 1</span></td>
    <td><span class="sentence">row 2, cell 2</span></td>
  </tr>
  </tbody>
</table>
`
  t.equal(tidy(have), tidy(want), 'no-header')

  t.end()
})
