import { readPage } from '../../_examples/index.js'
import test from 'tape'
import wtf from '../../lib/index.js'

// Getter/setter contracts live in Document.test.js; these exercise full articles.
test('article sections retain their headings and support title lookup', (t) => {
  const doc = wtf(readPage('Charlie-Milstead'))
  t.equal(doc.sections().length, 3)
  t.equal(doc.section().title(), '')
  t.equal(doc.section(1).title(), 'Career')
  t.equal(doc.section('Career'), doc.section(1))
  t.equal(doc.section('CAREER'), doc.section(1))
  t.match(doc.section('Career').text(), /Milstead/)
  t.end()
})

test('article paragraphs and sentences retain their order', (t) => {
  const doc = wtf(readPage('Statoil'))
  const paragraphs = doc.paragraphs()
  const sentences = doc.sentences()
  t.equal(paragraphs.length, 12)
  t.equal(sentences.length, 35)
  t.match(paragraphs[0].text(), /Statoil/)
  t.match(sentences[0].text(), /Statoil/)
  t.equal(doc.paragraph(1), paragraphs[1])
  t.equal(doc.paragraph(), paragraphs[0])
  t.equal(doc.paragraph('string'), paragraphs[0])
  t.deepEqual(doc.paragraphs('string'), paragraphs)
  t.equal(doc.sentence(1), sentences[1])
  t.equal(doc.sentence(), sentences[0])
  t.deepEqual(doc.sentences('string'), sentences)
  t.ok(paragraphs.every((paragraph) => paragraph.text().trim()), 'paragraphs contain text')
  t.end()
})

test('article images include gallery entries', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.images().length, 2)
  t.equal(doc.image().file(), 'File:20070701_Arts_Club_of_Chicago.JPG')
  t.equal(doc.image(1), doc.images()[1])
  t.deepEqual(doc.images('string'), doc.images())
  const gallery = wtf(readPage('Goryeo-Ware'))
  t.equal(gallery.images().length, 5)
  t.ok(gallery.images().every((image) => image.file() && image.url()), 'gallery images have filenames and URLs')
  t.end()
})

test('article links retain their targets and display text', (t) => {
  const doc = wtf(readPage('Britt-Morgan'))
  t.deepEqual(doc.links().map((link) => link.page()), [
    'Tyler, Texas',
    'Internet Adult Film Database',
    'Pornographic film actor',
    'List of members of the AVN Hall of Fame',
    'AVN Award',
    'Jace Rocker',
    'AVN Award for Best Supporting Actress',
    'Jace Rocker',
  ])
  t.deepEqual(doc.link(1).json(), { type: 'internal', page: 'Internet Adult Film Database', text: 'IAFD' })
  t.deepEqual(doc.links('Jace Rocker').map((link) => link.page()), ['Jace Rocker'])
  t.deepEqual(doc.links([]), doc.links())
  t.end()
})

//interwiki
test('interwiki - get - exclude internal links', (t) => {
  let str = readPage('Britt-Morgan')
  let doc = wtf(str)
  t.deepEqual(doc.interwiki(), [], 'internal links are not interwiki')
  t.end()
})

test('interwiki - get - access the second interwiki link', (t) => {
  const doc = wtf('[[Toronto]] [[fr:Paris]] [[de:Berlin]]')
  t.deepEqual(doc.interwiki()[1].json(), { type: 'interwiki', wiki: 'de', page: 'Berlin' }, 'the interwiki at index 1')
  t.end()
})

test('interwiki - get - if the clue is any other type then return all interwiki', (t) => {
  const doc = wtf('[[Toronto]] [[fr:Paris]] [[de:Berlin]]')
  const expected = [
    { type: 'interwiki', wiki: 'fr', page: 'Paris' },
    { type: 'interwiki', wiki: 'de', page: 'Berlin' },
  ]
  t.deepEqual(
    doc.interwiki([]).map((l) => l.json()),
    expected,
    'returns all interwiki'
  )
  t.end()
})

test('article lists retain their lines and support indexed access', (t) => {
  const doc = wtf(readPage('Anarchism'))
  t.equal(doc.lists().length, 4)
  t.equal(doc.list(1), doc.lists()[1])
  t.deepEqual(doc.lists('string'), doc.lists())
  t.ok(doc.lists().every((list) => list.lines().length > 0), 'each list contains lines')
  t.ok(doc.list(1).lines().every((line) => line.text().trim()), 'indexed list contains text')
  t.end()
})

test('article tables, templates and references remain queryable', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.tables().length, 2)
  t.deepEqual(doc.table(1).keyValue(), doc.tables()[1].keyValue())
  t.ok(doc.table(1).keyValue().length > 0, 'second table contains rows')
  t.equal(doc.templates().length, 8)
  t.equal(doc.template(1).json().template, 'good article')
  t.equal(doc.references().length, 34)
  t.equal(doc.reference(1), doc.references()[1])
  t.ok(doc.reference(1).title(), 'indexed reference has a title')
  t.deepEqual(doc.references('string'), doc.references())
  t.deepEqual(doc.citations(), doc.references())
  t.equal(doc.citation(1), doc.reference(1))
  t.deepEqual(doc.citations('string'), doc.references())
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
  t.deepEqual(doc.coordinate(1), expected, 'the coordinates at index 1')
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
  t.deepEqual(doc.infoboxes().map((box) => box.type()), ['venue', 'venue', 'venue'])
  t.deepEqual(doc.infoboxes().map((box) => box.get('name').text()), ['Royal Cinema', 'Royal Cinema', 'Royal Cinema'])
  t.equal(doc.infobox(1).get('former names').text(), 'The Pylon, The Golden Princess')
  t.equal(doc.infobox(1).get('caption').text(), 'The Royal Cinema in 2009')
  t.deepEqual(doc.infoboxes('string'), [], 'unmatched template name returns no infoboxes')
  t.end()
})
