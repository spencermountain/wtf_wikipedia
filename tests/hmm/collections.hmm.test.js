import test from 'tape'
import wtf from '../../src/index.ts'

test('collections: consistent link selection and output', (t) => {
  const doc = wtf('[[Toronto]] and [[Ottawa]].\n\n== Places ==\n[[Toronto]] again.')
  const links = doc.links()
  t.ok(Array.isArray(links), 'collections remain arrays')
  t.deepEqual(links.pages(), ['Toronto', 'Ottawa', 'Toronto'], 'preserve order and duplicates')
  t.deepEqual(doc.links('toronto').pages(), ['Toronto', 'Toronto'], 'string selection retains all matches')
  t.deepEqual(doc.links(1).pages(), ['Ottawa'], 'numeric selector addresses the whole document')
  t.equal(doc.links()[1].page(), 'Ottawa', 'singular selector is applied once')
  t.equal(doc.links().find((link) => link.page() === 'missing'), undefined, 'missing link is undefined')
  t.deepEqual(doc.links('missing').json(), [], 'plural miss supports JSON')
  t.equal(doc.links('missing').text(), '', 'empty text')
  t.equal(doc.links('missing').wikitext(), '', 'empty wikitext')
  ;[-1, 100, 0.5].forEach((index) => {
    t.deepEqual(doc.links(index).json(), [], `missing index ${index}`)
  })
  t.equal(links.json().length, 3, 'JSON has one entry per model')
  t.equal(links.text(), 'Toronto\nOttawa\nToronto', 'collection text joins item output')
  t.deepEqual(links.slice(1).select('Toronto').pages(), ['Toronto'], 'selection remains chainable')
  links.pop()
  t.equal(doc.links().length, 3, 'changing returned membership does not change document')
  t.end()
})

test('collections: tree accessors share selection behavior', (t) => {
  const doc = wtf('[[Toronto]] and [[Ottawa]].\n\n== Places ==\n[[Montreal]].\n\n=== More ===\n[[Quebec]].')
  const section = doc.sections()[0]
  const paragraph = section.paragraphs()[0]
  const sentence = paragraph.sentences()[0]
  ;[section, paragraph, sentence].forEach((model) => {
    t.deepEqual(model.links(1).pages(), ['Ottawa'], 'numeric selection at each level')
    t.equal(model.links()[1].page(), 'Ottawa', 'singular selection at each level')
    t.deepEqual(model.links('toronto').pages(), ['Toronto'], 'string selection at each level')
  })
  t.deepEqual(
    doc.sections('Places').map((s) => s.title()),
    ['Places'],
    'section title selection'
  )
  t.deepEqual(
    doc.section('places')
      .children('More')
      .map((s) => s.title()),
    ['More'],
    'children use collections'
  )
  t.deepEqual(doc.section('more').children().json(), [], 'empty child collection')
  t.equal(doc.paragraphs(0).json().length, 1, 'paragraph output')
  t.equal(doc.sentences(0).json().length, 1, 'sentence output')
  t.deepEqual(wtf('').references().json(), [], 'empty references')
  t.deepEqual(wtf('').images().json(), [], 'empty images')
  t.deepEqual(wtf('').templates().json(), [], 'empty templates')
  t.deepEqual(wtf('').infoboxes().json(), [], 'empty infoboxes')
  t.end()
})
