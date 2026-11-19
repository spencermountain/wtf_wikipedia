import test from 'tape'
import wtf from '../../lib/index.js'

const MAX_MS = 1000

// small pages that used to hang, throw, or grow out of memory
test('tiny pages parse quickly', (t) => {
  const arr = [
    '{|\n|colspan=100000000|a\n|}',
    '{|\n|rowspan=100000000|a\n|-\n|b\n|}',
    '{{loop|1e15}}',
    '{{loop|100000000|x}}',
    `${'{{loop|9|'.repeat(10)}x${'}}'.repeat(10)}`,
    `${'{{tag|'.repeat(30)}x${'}}'.repeat(30)}`,
    `${'{{britannica|'.repeat(24)}x${'}}'.repeat(24)}`,
    `{{replace|${'a'.repeat(30000)}|a|${'b'.repeat(30000)}}}`,
    `{{str rep|${'a'.repeat(30000)}|a|${"$'".repeat(15000)}}}`,
    'a &#9999999; b',
    'a &#x110000; b',
    '[[a&#9999999;]] b',
    '{{padleft:|99999999999|0}}',
    '{{padleft:|500000000|0}}',
    '{{padright:|500000000|0}}',
    '{{nbsp|-1}}',
    '{{binary|5|digits=99999999999}}',
    '{{percent|1|3|decimals=101}}',
    '{{percentage|1|3|101}}',
    '{{convert|1|ft|m|101}}',
    '{{convert|1|ft|m|sigfig=101}}',
    '{{decimal2base|5|99}}',
    '{{physconst|__proto__}}',
    '{{physconst|constructor}}',
    '{{bibleverse||John|\uD800}}',
  ]
  arr.forEach((str) => {
    const begin = Date.now()
    const doc = wtf(str)
    doc.text()
    doc.json()
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${JSON.stringify(str.slice(0, 40))} took ${ms}ms`)
  })
  t.end()
})

test('a lone surrogate does not break links or images', (t) => {
  t.doesNotThrow(() => wtf('[[\uD800]]').links()[0].href(), 'link')
  t.doesNotThrow(() => wtf('[[File:\uD800.jpg]]').images()[0].url(), 'image')
  t.equal(wtf('a 😀 b').text(), 'a 😀 b', 'real pairs are kept')
  t.end()
})

test('ordinary uses of these still work', (t) => {
  const arr = [
    ['{{loop|3|x}} y', 'xxx y'],
    ['{{padleft:7|3|0}} y', '007 y'],
    ['{{padright:7|3|0}} y', '700 y'],
    ['a &#233; b', 'a é b'],
    ['a &#x1F600; b', 'a 😀 b'],
    ['a &#9999999; b', 'a &#9999999; b'],
    ['a &#55296; b', 'a &#55296; b'],
    ['{{str rep|a b|a|$&}} c', '$& b c'],
    ['a (; b) c', 'a (b) c'],
    ['a ( ; ; b) c', 'a (b) c'],
    ['{{nowrap|{{nowrap|{{nowrap|a}}}}}} b', 'a b'],
    ['[[File:a b.png|thumb|c]] d', 'd'],
  ]
  arr.forEach(([str, want]) => {
    t.equal(wtf(str).text(), want, str)
  })
  t.equal(wtf('[[File:a b.png|thumb|c]] d').images()[0].file(), 'File:a_b.png', 'file name')
  t.end()
})

test('table spans still fill their columns', (t) => {
  const cells = (str) => wtf(str).tables()[0].json().rows.map((row) => Object.values(row).map((cell) => cell.text))
  t.deepEqual(cells('{|\n! a !! b !! c\n|-\n|colspan=2|x\n|y\n|}'), [['x', '', 'y']], 'colspan')
  t.deepEqual(cells('{|\n! a !! b\n|-\n|rowspan=2|x\n|y\n|-\n|z\n|}'), [['x', 'y'], ['x', 'z']], 'rowspan')
  t.deepEqual(cells('{|\n! a\n|-\n|b\nc\nd\n|}'), [['b c d']], 'a cell over many lines')
  t.end()
})

// each of these used to multiply one limit by the size of the page
test('large hostile pages stay linear', (t) => {
  const arr = [
    ['rowspans', `{|\n${'|-\n|rowspan=99999|a\n'.repeat(5000)}|}`],
    ['one long rowspan', `{|\n|-\n|rowspan=9999999|${'x '.repeat(60000)}\n${'|-\n|b\n'.repeat(20000)}|}`],
    ['colspans', `{|\n${'|-\n|colspan=1000|a\n'.repeat(8000)}|}`],
    ['long header', `{|\n! ${'x'.repeat(100000)}\n${'|-\n|a\n'.repeat(20000)}|}`],
    ['nfl logs', '{{nfl schedule start}}'.repeat(10000)],
    ['file: in a caption', `[[${'file:'.repeat(60000)}\n]]`],
    ['deep, with many children', `${'{{a|'.repeat(39)}${'x '.repeat(100000)}${'{{b}}'.repeat(5000)}${'}}'.repeat(39)}`],
    ['long text and many links', `${'[ '.repeat(100000)}${'[[a]]'.repeat(2000)}`],
    ['blocks of links', `${'[ '.repeat(40000)}${'[[a]]'.repeat(1000)}''b''\n\n`.repeat(3)],
  ]
  arr.forEach(([label, str]) => {
    const begin = Date.now()
    wtf(str)
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${label} took ${ms}ms`)
  })
  t.end()
})
