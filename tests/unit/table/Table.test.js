import test from 'tape'
import wtf from '../../lib/index.js'

// links
test('links - should not return links if there are none', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2 || Cell 3
        |-
        ! Row header A
        | Cell B
        | Cell C
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(table.links(), [], 'should return the links of the table')
  t.end()
})

test('links - should return links if there are any', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.links().map(l => l.text()),
    ['wikipedia'],
    'should return the links of the table',
  )
  t.end()
})

test('links - should return links if there are any with string clue', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | [[Wiki commons]]
        | [[Wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.links('wikipedia').map(l => l.text()),
    ['Wikipedia'],
    'should return the links of the table',
  )
  t.deepEqual(
    table.links('Fortnight').map(l => l.text()),
    [],
    'should return the links of the table',
  )
  t.end()
})

// get
test('get - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.get('Column header 1'),
    ['Row header 1', 'Row header A'],
    'should return the correct value',
  )
  t.end()
})

test('get - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.get(['Column header 1', 'Column header 2']),
    [
      {
        'Column header 1': 'Row header 1', 'Column header 2': 'Cell 2',
      },
      {
        'Column header 1': 'Row header A', 'Column header 2': 'Cell B',
      },
    ],
    'should return the correct value',
  )
  t.end()
})

// keyValue
test('keyValue - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.keyValue(),
    [
      {
        'Column header 1': 'Row header 1',
        'Column header 2': 'Cell 2',
        'Column header 3': 'Cell 3',
      },
      {
        'Column header 1': 'Row header A',
        'Column header 2': 'Cell B',
        'Column header 3': 'wikipedia',
      },
    ],
    'should return the correct value',
  )
  t.end()
})

// json
test('json - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.json(),
    [ { 'Column header 1': { text: 'Row header 1' }, 'Column header 2': { text: 'Cell 2' }, 'Column header 3': { text: 'Cell 3' } }, { 'Column header 1': { text: 'Row header A' }, 'Column header 2': { text: 'Cell B' }, 'Column header 3': { text: 'wikipedia', links: [ { text: 'wikipedia', type: 'internal', page: 'wikipedia' } ] } } ],
    'should return the correct value',
  )
  t.end()
})

// text
test('text - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.equal(table.text(), '', 'should return the correct value')
  t.end()
})

// wikitext
test('wikitext - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.wikitext(),
    `{| class=wikitable\n        |+ The table\'s caption\n        ! Column header 1\n        ! Column header 2\n        ! Column header 3\n        |-\n        ! Row header 1\n        | Cell 2\n        | Cell 3\n        |-\n        ! Row header A\n        | Cell B\n        | [[wikipedia]]\n        |}`,
    'should return the correct value',
  )
  t.end()
})

// keyvalue
test('keyvalue - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.keyvalue(),
    [
      {
        'Column header 1': 'Row header 1',
        'Column header 2': 'Cell 2',
        'Column header 3': 'Cell 3',
      },
      {
        'Column header 1': 'Row header A',
        'Column header 2': 'Cell B',
        'Column header 3': 'wikipedia',
      },
    ],
    'should return the correct value',
  )
  t.end()
})

// keyval
test('keyval - should return the correct value', (t) => {
  const doc = wtf(`
    {| class=wikitable
        |+ The table's caption
        ! Column header 1
        ! Column header 2
        ! Column header 3
        |-
        ! Row header 1
        | Cell 2
        | Cell 3
        |-
        ! Row header A
        | Cell B
        | [[wikipedia]]
        |}
    `)

  const table = doc.tables()[0]
  t.deepEqual(
    table.keyval(),
    [
      {
        'Column header 1': 'Row header 1',
        'Column header 2': 'Cell 2',
        'Column header 3': 'Cell 3',
      },
      {
        'Column header 1': 'Row header A',
        'Column header 2': 'Cell B',
        'Column header 3': 'wikipedia',
      },
    ],
    'should return the correct value',
  )
  t.end()
})