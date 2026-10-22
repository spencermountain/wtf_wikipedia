import test from 'tape'
import wtf from '../../lib/index.js'

const TABLE = `{| class="wikitable"
! Name !! Team !! Points
|-
| jane || us || 12
|-
| maya || ca || 15
|}`

test('table.get - one column, case-insensitive', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(tb.get('name'), ['jane', 'maya'], 'lowercase column lookup')
  t.deepEqual(tb.get('POINTS'), ['12', '15'], 'uppercase column lookup')
  t.end()
})

test('table.get - several columns give row-objects, keyed by real header', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(tb.get(['name', 'points']), [
    { Name: 'jane', Points: '12' },
    { Name: 'maya', Points: '15' },
  ],
    'multiple column rows')
  t.end()
})

test('table.get - a missing column is null per-row', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(tb.get('nope'), [null, null], 'missing column values')
  t.end()
})

test('table.keyValue aliases agree', (t) => {
  const tb = wtf(TABLE).tables()[0]
  const expected = [
    { Name: 'jane', Team: 'us', Points: '12' },
    { Name: 'maya', Team: 'ca', Points: '15' },
  ]
  t.deepEqual(tb.keyValue(), expected, 'keyValue rows')
  t.deepEqual(tb.keyvalue(), expected, 'keyvalue alias')
  t.deepEqual(tb.keyval(), expected, 'keyval alias')
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
  let data = doc.tables()[0].get('header 2')
  t.deepEqual(data, ['row 1, cell 2', 'row 2, cell 2', 'row 3, cell 2'], 'table columns')

  data = doc.tables()[0].get(['header 2', 'asdf', 'Header 1'])
  t.equal(data.length, 3, 'still three')
  t.equal(Object.keys(data).length, 3, 'three keys')

  t.equal(doc.tables()[0].wikitext(), str, 'table-wikitext')
  t.end()
})
