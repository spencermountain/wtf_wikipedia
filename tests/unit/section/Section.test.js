import test from 'tape'
import wtf from '../../lib/index.js'

// one small page exercises every Section accessor - real values, no cached pages
const PAGE = `'''Testville''' is a small test page. It has two sentences.
{{Infobox person
| name = Jane Doe
| age = 44
}}
{{coord|43.65|-79.38|display=title}}

==History==
The [[Rome|city]] was founded in 1904. It grew [[quickly]].

A second paragraph, with a [[Fun|link]] here.

===Early days===
* one fish
* two fish
[[File:Crest.jpg|thumb|the crest]]
Nested text here.<ref>{{cite web|url=http://example.com|title=Some Ref}}</ref>

{| class="wikitable"
! name !! age
|-
| jane || 40
|}

==Career==
Career text goes here.

==See also==
* [[Other page]]
`
const doc = wtf(PAGE)

test('section - title / depth / indentation / index', (t) => {
  const shape = doc.sections().map((s) => [s.title(), s.depth(), s.indentation(), s.index()])
  t.deepEqual(shape, [
    ['', 0, 0, 0],
    ['History', 0, 0, 1],
    ['Early days', 1, 1, 2],
    ['Career', 0, 0, 3],
    ['See also', 0, 0, 4],
  ])
  t.end()
})

test('section - sentences', (t) => {
  const sec = doc.section('History')
  t.deepEqual(
    sec.sentences().map((s) => s.text()),
    ['The city was founded in 1904.', 'It grew quickly.', 'A second paragraph, with a link here.']
  )
  t.equal(sec.sentence(1).text(), 'It grew quickly.', 'sentence by index')
  t.equal(sec.sentence().text(), 'The city was founded in 1904.', 'first sentence')
  t.equal(sec.sentence(9), null, 'missing index is null')
  t.end()
})

test('section - paragraphs', (t) => {
  const sec = doc.section('History')
  t.deepEqual(
    sec.paragraphs().map((p) => p.sentences().length),
    [2, 1],
    'two paragraphs'
  )
  t.equal(sec.paragraph(1).text(), 'A second paragraph, with a link here.', 'paragraph by index')
  t.equal(sec.paragraph().sentences().length, 2, 'first paragraph')
  t.end()
})

test('section - links', (t) => {
  const sec = doc.section('History')
  t.deepEqual(
    sec.links().map((l) => l.page()),
    ['Rome', 'quickly', 'Fun']
  )
  t.equal(sec.link(1).page(), 'quickly', 'link by index')
  t.equal(sec.links('rome')[0].page(), 'Rome', 'link by name, case-insensitive')
  t.equal(doc.section('Career').link(), null, 'no links is null')
  t.end()
})

test('section - tables', (t) => {
  const sec = doc.section('Early days')
  t.deepEqual(sec.tables().map((tb) => tb.keyValue()), [[{ name: 'jane', age: '40' }]])
  t.deepEqual(sec.table(0).keyValue(), [{ name: 'jane', age: '40' }], 'table by index')
  t.equal(doc.section('Career').table(), null, 'no tables is null')
  t.end()
})

test('section - templates', (t) => {
  const sec = doc.section(0)
  t.deepEqual(
    sec.templates().map((tm) => tm.json()),
    [{ display: 'title', template: 'coord', lat: 43.65, lon: -79.38 }]
  )
  t.equal(sec.templates('coord').length, 1, 'templates by name')
  t.equal(sec.template('coord').json().lat, 43.65, 'template by name')
  t.deepEqual(doc.section('History').templates(), [], 'no templates')
  t.end()
})

test('section - infoboxes', (t) => {
  const sec = doc.section(0)
  t.equal(sec.infoboxes().length, 1)
  t.equal(sec.infobox().type(), 'person')
  t.equal(sec.infobox().get('name').text(), 'Jane Doe')
  t.deepEqual(sec.infobox().keyValue(), { name: 'Jane Doe', age: '44' })
  t.equal(doc.section('Career').infobox(), null, 'no infobox is null')
  t.end()
})

test('section - coordinates', (t) => {
  const sec = doc.section(0)
  t.deepEqual(sec.coordinates(), [{ display: 'title', template: 'coord', lat: 43.65, lon: -79.38 }])
  t.equal(sec.coordinate().lat, 43.65, 'first coordinate')
  t.equal(doc.section('Career').coordinate(), null, 'no coordinates is null')
  t.end()
})

test('section - lists', (t) => {
  const sec = doc.section('Early days')
  t.deepEqual(
    sec.lists().map((l) => l.lines().map((s) => s.text())),
    [['one fish', 'two fish']]
  )
  t.equal(sec.list(0).lines().length, 2, 'list by index')
  t.equal(doc.section('Career').list(), null, 'no lists is null')
  t.end()
})

test('section - images', (t) => {
  const sec = doc.section('Early days')
  t.deepEqual(
    sec.images().map((i) => [i.file(), i.caption()]),
    [['File:Crest.jpg', 'the crest']]
  )
  t.equal(sec.image().url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Crest.jpg')
  t.equal(doc.section('Career').image(), null, 'no images is null')
  t.deepEqual(doc.section(0).images(), [], 'infobox-only section has no images')
  t.end()
})

test('section - references', (t) => {
  const sec = doc.section('Early days')
  t.deepEqual(sec.references().map((r) => r.title()), ['Some Ref'])
  t.equal(sec.citation().title(), 'Some Ref', 'citation alias')
  t.equal(doc.section('Career').reference(), null, 'no references is null')
  t.end()
})

test('section - interwiki', (t) => {
  t.deepEqual(doc.section('History').interwiki(), [], 'internal links are not interwiki')
  const d2 = wtf('==Also==\nsee [[Rome]] and [[fr:Paris]] here.')
  t.deepEqual(
    d2.section('Also').interwiki().map((l) => l.json()),
    [{ type: 'interwiki', wiki: 'fr', page: 'Paris' }],
    'interwiki links only'
  )
  t.deepEqual(d2.interwiki().map((l) => l.page()), ['Paris'], 'doc-level too')
  t.end()
})

// navigation
test('section - children / parent', (t) => {
  const hist = doc.section('History')
  t.deepEqual(hist.children().map((s) => s.title()), ['Early days'])
  t.equal(hist.children('early days').title(), 'Early days', 'child by name, case-insensitive')
  t.deepEqual(hist.sections().map((s) => s.title()), ['Early days'], 'sections is an alias')
  t.equal(doc.section('Early days').parent().title(), 'History')
  t.equal(hist.parent(), null, 'top-level section has no parent')
  t.deepEqual(doc.section('Career').children(), [], 'no children')
  t.end()
})

test('section - siblings', (t) => {
  t.equal(doc.section('History').nextSibling().title(), 'Career', 'nextSibling skips own children')
  t.equal(doc.section('History').next().title(), 'Career', 'next is an alias')
  t.equal(doc.section('Career').previousSibling().title(), 'History', 'previousSibling skips deeper sections')
  t.equal(doc.section('See also').previousSibling().title(), 'Career')
  t.equal(doc.section('Early days').lastSibling(), null, 'a first-child has no previous sibling')
  t.equal(doc.section('See also').nextSibling(), null, 'last section has no nextSibling')
  t.end()
})

// output
test('section - text / json / wikitext', (t) => {
  const sec = doc.section('Career')
  t.equal(sec.text(), 'Career text goes here.')
  t.equal(sec.wikitext(), '\nCareer text goes here.\n')
  t.deepEqual(sec.json(), {
    title: 'Career',
    depth: 0,
    paragraphs: [{ sentences: [{ text: 'Career text goes here.' }] }],
  })
  t.end()
})

test('section - remove', (t) => {
  const fresh = wtf(PAGE)
  const out = fresh.section('History').remove()
  t.deepEqual(
    out.sections().map((s) => s.title()),
    ['', 'Career', 'See also'],
    'removes the section and its children'
  )
  t.end()
})
