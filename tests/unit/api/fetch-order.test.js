import test from 'tape'
import wtf from '../../lib/index.js'
import mockFetch from '../../lib/mockFetch.js'

const page = (pageid, title, wiki) => ({
  pageid,
  ns: 0,
  title,
  revisions: [{ revid: 1, timestamp: '2024-01-01T00:00:00Z', slots: { main: { content: wiki } } }],
  pageprops: {},
})

test('fetch: results keep the requested title order', async (t) => {
  // the api returns pages in its own order - usually ascending pageid
  const res = { batchcomplete: true, query: { pages: [page(22309, 'Oslo', 'oslo!'), page(30057, 'Tokyo', 'tokyo!')] } }
  await mockFetch(res, async () => {
    const docs = await wtf.fetch(['Tokyo', 'Oslo'])
    t.deepEqual(
      docs.map((d) => d.title),
      ['Tokyo', 'Oslo'],
      'title order follows input'
    )
  })
  t.end()
})

test('fetch: order holds through normalization and redirects', async (t) => {
  const res = {
    batchcomplete: true,
    query: {
      normalized: [
        { from: 'Toronto,_Ontario', to: 'Toronto, Ontario' },
        { from: 'oslo', to: 'Oslo' },
      ],
      redirects: [{ from: 'Toronto, Ontario', to: 'Toronto' }],
      pages: [page(22309, 'Oslo', 'oslo!'), page(64646, 'Toronto', 'toronto!')],
    },
  }
  await mockFetch(res, async () => {
    const docs = await wtf.fetch(['Toronto, Ontario', 'oslo'])
    t.deepEqual(
      docs.map((d) => d.title),
      ['Toronto', 'Oslo'],
      'redirected + normalized titles keep their slots'
    )
  })
  t.end()
})

test('fetch: pageid order follows input', async (t) => {
  const res = { batchcomplete: true, query: { pages: [page(22309, 'Oslo', 'oslo!'), page(30057, 'Tokyo', 'tokyo!')] } }
  await mockFetch(res, async () => {
    const docs = await wtf.fetch([30057, 22309])
    t.deepEqual(
      docs.map((d) => d.title),
      ['Tokyo', 'Oslo'],
      'pageid order follows input'
    )
  })
  t.end()
})

test('fetch: missing pages are skipped without breaking order', async (t) => {
  const res = {
    batchcomplete: true,
    query: {
      pages: [page(22309, 'Oslo', 'oslo!'), { ns: 0, title: 'Zzzxq', missing: true }, page(30057, 'Tokyo', 'tokyo!')],
    },
  }
  await mockFetch(res, async () => {
    const docs = await wtf.fetch(['Tokyo', 'Zzzxq', 'Oslo'])
    t.deepEqual(
      docs.map((d) => d.title),
      ['Tokyo', 'Oslo'],
      'found pages stay in input order'
    )
  })
  t.end()
})
