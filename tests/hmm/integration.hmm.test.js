import { readPage } from '../_examples/index.js'
import test from 'tape'
import wtf from '../lib/index.js'

// Getter/setter contracts live in Document.test.js; these exercise full articles.
test('article sections retain their headings and support title lookup', (t) => {
  const doc = wtf(readPage('Charlie-Milstead'))
  t.equal(doc.sections().length, 3, 'section count')
  t.equal(doc.section().title(), '', 'first section title')
  t.equal(doc.section(1).title(), 'Career', 'indexed section title')
  t.equal(doc.section('Career'), doc.section(1), 'title lookup')
  t.equal(doc.section('CAREER'), doc.section(1), 'case-insensitive lookup')
  t.match(doc.section('Career').text(), /Milstead/, 'section text')
  t.end()
})

test('article paragraphs and sentences retain their order', (t) => {
  const doc = wtf(readPage('Statoil'))
  const paragraphs = doc.paragraphs()
  const sentences = doc.sentences()
  t.equal(paragraphs.length, 12, 'paragraph count')
  t.equal(sentences.length, 35, 'sentence count')
  t.match(paragraphs[0].text(), /Statoil/, 'first paragraph text')
  t.match(sentences[0].text(), /Statoil/, 'first sentence text')
  t.equal(doc.paragraphs()[1], paragraphs[1], 'indexed paragraph')
  t.equal(doc.paragraphs()[0], paragraphs[0], 'default paragraph')
  t.ok(doc.paragraphs('string').length === 0, 'unsupported paragraphs selector returns an empty collection')
  t.equal(doc.sentence(1), sentences[1], 'indexed sentence')
  t.equal(doc.sentences()[0], sentences[0], 'default sentence')
  t.ok(doc.sentences('string').length === 0, 'unsupported sentences selector returns an empty collection')
  t.ok(
    paragraphs.every((paragraph) => paragraph.text().trim()),
    'paragraphs contain text'
  )
  t.end()
})

test('article images include gallery entries', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.images().length, 2, 'image count')
  t.equal(doc.images()[0].file(), 'File:20070701_Arts_Club_of_Chicago.JPG', 'first image filename')
  t.ok(doc.images('string').length === 0, 'unsupported images selector returns an empty collection')
  const gallery = wtf(readPage('Goryeo-Ware'))
  t.equal(gallery.images().length, 5, 'gallery image count')
  t.ok(
    gallery.images().every((image) => image.file() && image.url()),
    'gallery images have filenames and URLs'
  )
  t.end()
})

test('article links retain their targets and display text', (t) => {
  const doc = wtf(readPage('Britt-Morgan'))
  t.deepEqual(
    doc.links().map((link) => link.page()),
    [
      'Tyler, Texas',
      'Internet Adult Film Database',
      'Pornographic film actor',
      'List of members of the AVN Hall of Fame',
      'AVN Award',
      'Jace Rocker',
      'AVN Award for Best Supporting Actress',
      'Jace Rocker',
    ],
    'link targets'
  )
  t.deepEqual(
    doc.links()[1].json(),
    { type: 'internal', page: 'Internet Adult Film Database', text: 'IAFD' },
    'indexed link JSON'
  )
  t.deepEqual(
    doc.links('Jace Rocker').map((link) => link.page()),
    ['Jace Rocker', 'Jace Rocker'],
    'filtered link targets'
  )
  t.ok(doc.links([]).length === 0, 'unsupported link selector returns an empty collection')
  t.end()
})

//interwiki
test('interwiki - get - exclude internal links', (t) => {
  let str = readPage('Britt-Morgan')
  let doc = wtf(str)
  t.ok(doc.interwiki().length === 0, 'internal links are not interwiki')
  t.end()
})

test('interwiki - get - access the second interwiki link', (t) => {
  const doc = wtf('[[Toronto]] [[fr:Paris]] [[de:Berlin]]')
  t.deepEqual(doc.interwiki()[1].json(), { type: 'interwiki', wiki: 'de', page: 'Berlin' }, 'the interwiki at index 1')
  t.end()
})

test('interwiki - get - return all links without a selector and none for unsupported selectors', (t) => {
  const doc = wtf('[[Toronto]] [[fr:Paris]] [[de:Berlin]]')
  const expected = [
    { type: 'interwiki', wiki: 'fr', page: 'Paris' },
    { type: 'interwiki', wiki: 'de', page: 'Berlin' },
  ]
  t.deepEqual(doc.interwiki().json(), expected, 'returns all interwiki')
  t.ok(doc.interwiki([]).length === 0, 'unsupported selector returns an empty collection')
  t.end()
})

test('article lists retain their lines and support indexed access', (t) => {
  const doc = wtf(readPage('Anarchism'))
  t.equal(doc.lists().length, 4, 'list count')
  t.deepEqual(doc.lists('string'), doc.lists(), 'unsupported list selector')
  t.ok(
    doc.lists().every((list) => list.lines().length > 0),
    'each list contains lines'
  )
  t.ok(
    doc
      .lists()[1]
      .lines()
      .every((line) => line.text().trim()),
    'indexed list contains text'
  )
  t.end()
})

test('article tables, templates and references remain queryable', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.tables().length, 2, 'table count')
  t.ok(doc.tables()[1].keyValue().length > 0, 'second table contains rows')
  t.equal(doc.templates().length, 8, 'template count')
  t.equal(doc.template(1).json().template, 'good article', 'indexed template name')
  t.equal(doc.references().length, 34, 'reference count')
  t.ok(doc.references()[1].title(), 'indexed reference has a title')
  t.ok(doc.references('string').length === 0, 'unsupported references selector returns an empty collection')
  t.deepEqual(doc.citations(), doc.references(), 'citation collection')
  t.equal(doc.citations()[1], doc.references()[1], 'indexed citation')
  t.ok(doc.citations('string').length === 0, 'unsupported citations selector returns an empty collection')
  t.end()
})

//coordinates
test('coordinates - get - return all coordinates', (t) => {
  let str = readPage('Dollar-Point-California')
  let doc = wtf(str)
  const expected = [
    {
      display: 'inline,title',
      template: 'coord',
      props: { region: 'US_type:city' },
      lat: 39.18861,
      lon: -120.10889,
    },
    {
      template: 'coord',
      props: { type: 'city' },
      lat: 39.18861,
      lon: -120.10889,
    },
  ]
  t.deepEqual(doc.coordinates(), expected, 'returns all coordinates')
  t.end()
})

test('coordinates - get - if the clue is a number return the coordinates at that index', (t) => {
  let str = readPage('Dollar-Point-California')
  let doc = wtf(str)
  const expected = {
    template: 'coord',
    props: { type: 'city' },
    lat: 39.18861,
    lon: -120.10889,
  }
  t.deepEqual(doc.coordinates()[1], expected, 'the coordinates at index 1')
  t.end()
})

test('coordinates - get - if the clue is any other type then return all coordinates', (t) => {
  let str = readPage('Dollar-Point-California')
  let doc = wtf(str)
  const expected = [
    {
      display: 'inline,title',
      template: 'coord',
      props: { region: 'US_type:city' },
      lat: 39.18861,
      lon: -120.10889,
    },
    {
      template: 'coord',
      props: { type: 'city' },
      lat: 39.18861,
      lon: -120.10889,
    },
  ]
  t.deepEqual(doc.coordinates('string'), expected, 'returns all coordinates')
  t.end()
})

const infoboxPage = `
{{Infobox venue
| name = Royal Cinema
| nickname            =
| former names        = The Pylon, The Golden Princess
| logo_image          =
| logo_caption        =
}}
{{Infobox venue
| name = Royal Cinema
| nickname            =
| former names        = The Pylon, The Golden Princess
| logo_image          =
| logo_caption        =
| image               = Royal_Cinema.JPG
| image_size          = 250px
| caption             = The Royal Cinema in 2009
}}
{{Infobox venue
| name = Royal Cinema
| nickname            =
| former names        = The Pylon, The Golden Princess
| logo_image          =
| logo_caption        =
| image               = Royal_Cinema.JPG
| image_size          = 250px
| caption             = The Royal Cinema in 2009
}}
`

test('multiple infoboxes retain their fields and images', (t) => {
  const doc = wtf(infoboxPage)
  t.deepEqual(
    doc.infoboxes().map((box) => box.type()),
    ['venue', 'venue', 'venue'],
    'infobox types'
  )
  t.deepEqual(
    doc.infoboxes().map((box) => box.get('name').text()),
    ['Royal Cinema', 'Royal Cinema', 'Royal Cinema'],
    'infobox names'
  )
  t.equal(doc.infobox(1).get('former names').text(), 'The Pylon, The Golden Princess', 'former names field')
  t.equal(doc.infobox(1).get('caption').text(), 'The Royal Cinema in 2009', 'caption field')
  t.ok(doc.infoboxes('string').length === 0, 'unmatched template name returns no infoboxes')
  t.end()
})
