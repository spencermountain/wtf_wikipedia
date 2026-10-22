import test from 'tape'
import wtf from '../../lib/index.js'

const TABLE = `{| class="wikitable"
! Name !! Team !! Points
|-
| [[Jane|jane]] || us || 12
|-
| maya || ca || 0
|-
| alex || || 7
|}`

const table = () => wtf(TABLE).tables()[0]

test('table.getRows - string selects a flat column of text', (t) => {
  t.deepEqual(table().getRows('Name'), ['jane', 'maya', 'alex'], 'cell markup becomes plain text')
  t.deepEqual(table().getRows('Points'), ['12', '0', '7'], 'numeric cells remain strings')
  t.deepEqual(table().getRows('Team'), ['us', 'ca', ''], 'empty cells preserve row positions')
  t.end()
})

test('table.getRows - array selects columns in requested order', (t) => {
  t.deepEqual(table().getRows(['Points', 'Name']), [
    ['12', 'jane'],
    ['0', 'maya'],
    ['7', 'alex'],
  ], 'column order follows the request and row order follows the table')
  t.deepEqual(table().getRows(['Name']), [['jane'], ['maya'], ['alex']], 'one column still returns nested arrays')
  t.end()
})

test('table.getRows - object includes enabled columns', (t) => {
  t.deepEqual(table().getRows({ Name: true, Team: false, Points: true }), [
    { name: 'jane', points: '12' },
    { name: 'maya', points: '0' },
    { name: 'alex', points: '7' },
  ], 'disabled columns are omitted and normalized headers are used')
  t.end()
})

test('table.getRows - empty selections preserve rows', (t) => {
  t.deepEqual(table().getRows([]), [[], [], []], 'empty array selects no columns')
  t.deepEqual(table().getRows({}), [{}, {}, {}], 'empty object selects no columns')
  t.deepEqual(table().getRows({ Name: false }), [{}, {}, {}], 'all columns disabled')
  t.end()
})

test('table.getRows - missing columns preserve requested shape', (t) => {
  t.deepEqual(table().getRows('Missing'), [undefined, undefined, undefined], 'missing string column')
  t.deepEqual(table().getRows(['Name', 'Missing']), [
    ['jane', undefined],
    ['maya', undefined],
    ['alex', undefined],
  ], 'missing array column retains its position')
  t.deepEqual(table().getRows({ Missing: true }), [
    { missing: undefined },
    { missing: undefined },
    { missing: undefined },
  ], 'missing object column retains its key')
  t.end()
})

test('table.getRows - repeated selections retain cell text', (t) => {
  const tb = table()
  t.deepEqual(tb.getRows('Name'), ['jane', 'maya', 'alex'], 'first selection')
  t.deepEqual(tb.getRows(['Points', 'Name']), [
    ['12', 'jane'],
    ['0', 'maya'],
    ['7', 'alex'],
  ], 'array selection after string selection')
  t.deepEqual(tb.getRows({ Team: true }), [
    { team: 'us' },
    { team: 'ca' },
    { team: '' },
  ], 'object selection after array selection')
  t.end()
})
