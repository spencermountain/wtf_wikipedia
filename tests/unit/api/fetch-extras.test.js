import test from 'tape'
import wtf from '../../lib/index.js'
import mockFetch from '../../lib/mockFetch.js'

// a minimal formatversion=2 api response, with page fields merged over the base
const makeResponse = (page) => ({
  batchcomplete: true,
  query: {
    pages: [
      {
        pageid: 123,
        ns: 0,
        title: 'Foo',
        revisions: [{ revid: 99, timestamp: '2024-01-01T00:00:00Z', slots: { main: { content: 'hello [[world]]' } } }],
        pageprops: {},
        ...page,
      },
    ],
  },
})

test('fetch meta: pageprops extras are exposed', async (t) => {
  const res = makeResponse({
    title: 'The Art of War',
    description: 'ancient Chinese military treatise',
    pageprops: {
      disambiguation: '',
      defaultsort: 'Art Of War, The',
      displaytitle: '<i>The Art of War</i>',
      page_image: 'Bamboo_book.jpg',
      wikibase_item: 'Q8251',
    },
  })
  await mockFetch(res, async () => {
    const doc = await wtf.fetch('The Art of War')
    t.equal(doc.description, 'ancient Chinese military treatise', 'description from the api module')
    t.equal(doc.pageImage, 'Bamboo_book.jpg', 'non-free page_image fallback')
    t.equal(doc.displayTitle, 'The Art of War', 'displaytitle html is stripped')
    t.equal(doc.defaultSort, 'Art Of War, The', 'defaultsort')
    t.equal(doc.wikidata, 'Q8251', 'wikidata id')
    t.equal(doc.isDisambig(), true, 'disambiguation pageprop is authoritative')
  })
  t.end()
})

test('fetch meta: missing extras fall back politely', async (t) => {
  const res = makeResponse({
    title: 'Toronto',
    pageprops: { 'wikibase-shortdesc': 'city in Ontario', page_image_free: 'Skyline.jpg' },
  })
  await mockFetch(res, async () => {
    const doc = await wtf.fetch('Toronto')
    t.equal(doc.description, 'city in Ontario', 'shortdesc pageprop still works')
    t.equal(doc.pageImage, 'Skyline.jpg', 'free page-image is preferred')
    t.equal(doc.displayTitle, 'Toronto', 'displayTitle falls back to title')
    t.equal(doc.defaultSort, null, 'no defaultsort')
    t.equal(doc.isDisambig(), false, 'not a disambiguation page')
  })
  t.end()
})
