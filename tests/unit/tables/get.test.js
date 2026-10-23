import test from 'tape'
import wtf from '../../lib/index.js'

const TABLE = `{| class="wikitable"
! Name !! Team !! Points
|-
| jane || us || 12
|-
| maya || ca || 15
|}`

test('table.getRows - one column, case-insensitive', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(tb.getRows('name'), ['jane', 'maya'], 'lowercase column lookup')
  t.deepEqual(tb.getRows('POINTS'), ['12', '15'], 'uppercase column lookup')
  t.end()
})

test('table.getRows - several columns give arrays in requested order', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(
    tb.getRows(['name', 'points']),
    [
      ['jane', '12'],
      ['maya', '15'],
    ],
    'multiple column rows'
  )
  t.end()
})

test('table.getRows - a missing column is undefined per row', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(tb.getRows('nope'), [undefined, undefined], 'missing column values')
  t.end()
})

test('Table-Columns-And-Wikitext', (t) => {
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
|-
| row 3, cell 1
| row 3, cell 2
| row 3, cell 3
|}`
  const doc = wtf(str)
  let data = doc.tables()[0].getRows('header 2')
  t.deepEqual(data, ['row 1, cell 2', 'row 2, cell 2', 'row 3, cell 2'], 'table columns')

  data = doc.tables()[0].getRows(['header 2', 'asdf', 'Header 1'])
  t.equal(data.length, 3, 'still three')
  t.deepEqual(data, [
    ['row 1, cell 2', undefined, 'row 1, cell 1'],
    ['row 2, cell 2', undefined, 'row 2, cell 1'],
    ['row 3, cell 2', undefined, 'row 3, cell 1'],
  ], 'requested column order and missing values')

  t.equal(doc.tables()[0].wikitext(), str, 'table-wikitext')
  t.end()
})
