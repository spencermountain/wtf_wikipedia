import test from 'tape'
import wtf from '../../lib/index.js'

const items = (str, n = 0) => (wtf(str).lists()[n]?.lines() || []).map((l) => l.text())

test('lists - item text', (t) => {
  const cases = [
    ['bullets', '* apple\n* banana\n* cherry', ['apple', 'banana', 'cherry']],
    ['nested bullets', '* fruit\n** apple\n** banana\n* vegetable', ['fruit', 'apple', 'banana', 'vegetable']],
    ['deep nesting', '* a\n** b\n*** c\n**** d', ['a', 'b', 'c', 'd']],
    ['mixed *#', '* fruit\n*# apple\n*# banana\n* vegetable', ['fruit', 'apple', 'banana', 'vegetable']],
    ['ordered', '# first item\n# second item\n# third item', ['1) first item', '2) second item', '3) third item']],
    ['definition list', '; Term\n: Definition\n; Other\n: Meaning', ['Term', 'Definition', 'Other', 'Meaning']],
    ['indent-only', ': indented text\n:: more indented', ['indented text', 'more indented']],
    [
      'links are plain text',
      '* [[Toronto]] in Canada\n* [[Paris|the capital]] of France',
      ['Toronto in Canada', 'the capital of France'],
    ],
    ['bold and italics stripped', "* '''bold''' item\n* ''italic'' item", ['bold item', 'italic item']],
    ['no space after bullet', '*tight\n*packed', ['tight', 'packed']],
    ['empty items are dropped', '* one\n*\n* two', ['one', 'two']],
  ]
  cases.forEach(([name, str, want]) => {
    t.deepEqual(items(str), want, name)
  })
  t.end()
})

test('lists - links and formatting inside items', (t) => {
  const doc = wtf('* [[Toronto]] city\n* [[Paris|the capital]] of France\n* plain')
  const lines = doc.lists()[0].lines()
  t.equal(lines.length, 3, 'three items')
  t.equal(lines[0].links()[0].page(), 'Toronto', 'first item link page')
  t.equal(lines[1].links()[0].page(), 'Paris', 'piped link page')
  t.equal(lines[1].links()[0].text(), 'the capital', 'piped link text')
  t.equal(lines[2].links().length, 0, 'plain item has no links')
  t.equal(doc.lists()[0].links().length, 2, 'list.links() gathers all item links')
  t.ok(
    doc.links().some((l) => l.page() === 'Paris'),
    'list links appear in doc.links()'
  )
  const bold = wtf("* '''Strong''' item").lists()[0].lines()[0]
  t.equal(bold.bolds()[0]?.text, 'Strong', 'bold span inside list item')
  t.end()
})

test('lists - boundaries', (t) => {
  t.equal(wtf('* a\n* b').lists().length, 1, 'one contiguous list')
  t.equal(wtf('* a\n* b\n\n* c').lists().length, 2, 'blank line separates lists')
  t.deepEqual(items('* a\n* b\n\n* c', 1), ['c'], 'second list after blank line')
  t.equal(wtf('Intro paragraph.\n* x\n* y').lists().length, 1, 'list after paragraph text')
  t.equal(wtf('Intro paragraph.\n* x\n* y').sentences()[0].text(), 'Intro paragraph.', 'intro text kept as sentence')
  t.equal(wtf('Just text, no list.').lists().length, 0, 'plain text has no list')
  t.equal(wtf('A star * in the middle.').lists().length, 0, 'mid-line asterisk is not a list')
  t.equal(
    wtf('== A ==\n* a1\n== B ==\n* b1\n* b2').section('B').lists()[0].lines().length,
    2,
    'lists scoped to their section'
  )
  t.equal(wtf('* a\n* b').lists()[0].wikitext(), '* a\n* b', 'list wikitext is the source lines')
  t.end()
})

test('lists - text output', (t) => {
  t.match(wtf('* apple\n* banana').text(), /\* apple\n \* banana/, 'bullets rendered in text()')
  t.end()
})

test('lists - known bugs', { todo: true }, (t) => {
  // numbering should restart for a nested level, not continue counting
  t.deepEqual(
    items('# one\n# two\n## two-a\n# three'),
    ['1) one', '2) two', '1) two-a', '3) three'],
    'nested ordered items do not advance the outer numbering'
  )
  // short ordered items (<4 chars) lose their numbering
  t.deepEqual(items('# a\n# b'), ['1) a', '2) b'], 'short ordered items are numbered')
  // text that follows a list on the next line is moved before the list in text()
  t.equal(wtf('* x\n* y\nAfter text.').text().trim(), '* x\n * y\nAfter text.', 'text after a list keeps its position')
  t.end()
})
