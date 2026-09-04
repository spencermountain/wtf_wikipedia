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
  t.deepEqual(tb.get('name'), ['jane', 'maya'])
  t.deepEqual(tb.get('POINTS'), ['12', '15'])
  t.end()
})

test('table.get - several columns give row-objects, keyed by real header', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(tb.get(['name', 'points']), [
    { Name: 'jane', Points: '12' },
    { Name: 'maya', Points: '15' },
  ])
  t.end()
})

test('table.get - a missing column is null per-row', (t) => {
  const tb = wtf(TABLE).tables()[0]
  t.deepEqual(tb.get('nope'), [null, null])
  t.end()
})

test('table.keyValue aliases agree', (t) => {
  const tb = wtf(TABLE).tables()[0]
  const expected = [
    { Name: 'jane', Team: 'us', Points: '12' },
    { Name: 'maya', Team: 'ca', Points: '15' },
  ]
  t.deepEqual(tb.keyValue(), expected)
  t.deepEqual(tb.keyvalue(), expected)
  t.deepEqual(tb.keyval(), expected)
  t.end()
})
