import test from 'tape'
import wtf from '../../lib/index.js'

const outline = `Intro text.
== History ==
History text.
=== Early years ===
Early text.
==== Childhood ====
Childhood text.
=== Later years ===
Later text.
== Early Life ==
Life text.`

test('sections - titles, depth and index', (t) => {
  const doc = wtf(outline)
  const secs = doc.sections()
  t.equal(secs.length, 6, 'intro plus five headings')
  const want = [
    ['', 0],
    ['History', 0],
    ['Early years', 1],
    ['Childhood', 2],
    ['Later years', 1],
    ['Early Life', 0],
  ]
  want.forEach(([title, depth], i) => {
    t.equal(secs[i].title(), title, `section ${i} title`)
    t.equal(secs[i].depth(), depth, `section ${i} '${title}' depth`)
    t.equal(secs[i].index(), i, `section ${i} index`)
  })
  t.equal(secs[0].text(), 'Intro text.', 'intro section text')
  t.equal(secs[3].text(), 'Childhood text.', 'deep section keeps only its own text')
  t.equal(doc.section('History').text(), 'History text.', 'parent section excludes child text')
  t.end()
})

test('sections - lookup', (t) => {
  const doc = wtf(outline)
  t.equal(doc.section('history').title(), 'History', 'lowercase lookup')
  t.equal(doc.section('EARLY LIFE').title(), 'Early Life', 'uppercase lookup')
  t.equal(doc.section('  Childhood  ').title(), 'Childhood', 'lookup trims whitespace')
  t.equal(doc.section(2).title(), 'Early years', 'lookup by index')
  t.equal(doc.section().title(), '', 'default is the intro section')
  t.equal(doc.section('missing').title(), '', 'missing section returns an empty section')
  t.equal(doc.section('missing').sentences().length, 0, 'empty section has no sentences')
  t.equal(doc.section(99).text(), '', 'out-of-range index returns an empty section')
  t.end()
})

test('sections - heading formatting', (t) => {
  const cases = [
    ['no spaces', '==Title==\nx.', 'Title'],
    ['extra inner spaces', '==   Title   ==\nx.', 'Title'],
    ['trailing whitespace on line', '== Title ==   \nx.', 'Title'],
    ['piped link', '== [[Toronto|The city]] history ==\nx.', 'The city history'],
    ['plain link', '== [[Toronto]] ==\nx.', 'Toronto'],
    ['bold', "== '''Bold''' title ==\nx.", 'Bold title'],
    ['italic', "== ''Italic'' title ==\nx.", 'Italic title'],
    ['template', '== Title {{small|note}} ==\nx.', 'Title note'],
    ['html comment', '== Title <!-- hidden --> ==\nx.', 'Title'],
    ['non-latin', '== 歴史 ==\nx.', '歴史'],
  ]
  cases.forEach(([name, str, want]) => {
    t.equal(wtf(str).sections()[0].title(), want, name)
  })
  t.equal(wtf('====== Six ======\nx.').sections()[0].depth(), 4, 'level-6 heading depth')
  t.equal(wtf('Some text == not a heading == here.').sections().length, 1, 'mid-line equals signs are not a heading')
  t.end()
})

test('sections - empty and duplicate', (t) => {
  const empty = wtf('== Empty ==\n== Next ==\nNext text.')
  t.equal(empty.sections().length, 2, 'empty section is kept')
  t.equal(empty.section('Empty').text(), '', 'empty section has no text')
  t.equal(empty.section('Next').text(), 'Next text.', 'following section unaffected')

  const dup = wtf('== Notes ==\nfirst.\n== Notes ==\nsecond.')
  t.equal(dup.sections().length, 2, 'duplicate titles are separate sections')
  t.equal(dup.section('Notes').text(), 'first.', 'lookup returns the first match')
  t.equal(dup.sections()[1].text(), 'second.', 'second duplicate reachable by index')

  const noIntro = wtf('== First ==\ntext.')
  t.equal(noIntro.sections()[0].title(), 'First', 'page starting with a heading has no empty intro')
  t.end()
})

test('sections - contents are scoped', (t) => {
  const doc = wtf(`Intro [[Paris]].
== A ==
See [[London]].
* item one
* item two
== B ==
{| class="wikitable"
! h
|-
| cell
|}
[[File:Pic.jpg|thumb|A picture]]`)
  t.deepEqual(
    doc
      .section('A')
      .links()
      .map((l) => l.page()),
    ['London'],
    'section links'
  )
  t.deepEqual(
    doc
      .section(0)
      .links()
      .map((l) => l.page()),
    ['Paris'],
    'intro links'
  )
  t.equal(doc.section('A').lists().length, 1, 'list in section A')
  t.equal(doc.section('B').lists().length, 0, 'no list in section B')
  t.equal(doc.section('B').tables().length, 1, 'table in section B')
  t.equal(doc.section('A').tables().length, 0, 'no table in section A')
  t.equal(doc.section('B').images().length, 1, 'image in section B')
  t.equal(doc.section('B').images()[0].file(), 'File:Pic.jpg', 'section image file')
  t.end()
})

test('sections - fixed bugs', (t) => {
  t.equal(
    wtf('== Title<ref>x</ref> ==\ntext.').sections()[0].title(),
    'Title',
    'reference in heading is removed from title'
  )
  t.equal(wtf('= Level one =\ntext.').sections()[0].title(), 'Level one', 'level-1 heading is recognised')
  // MediaWiki takes the smaller side as the level and keeps the extra '=' in the title
  t.equal(
    wtf('== Unbalanced ===\ntext.').sections()[0].title(),
    'Unbalanced =',
    'unbalanced heading keeps extra = in title'
  )
  t.equal(wtf('=== Left heavy ==\ntext.').sections()[0].depth(), 0, 'unbalanced heading level is the smaller side')
  t.end()
})
