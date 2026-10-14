import test from 'tape'
import wtf from '../../lib/index.js'
import mockFetch from '../../lib/mockFetch.js'

const page = {
  pageid: 1,
  title: 'Example',
  ns: 0,
  revisions: [{ '*': 'hello' }],
  pageprops: { wikibase_item: 'Q12', 'wikibase-shortdesc': 'general greeting' },
  hasOwnProperty: 'metadata',
}
const missing = Object.assign(Object.create(null), { ns: 0, title: 'Missing', missing: '' })

test('fetch filters missing pages and preserves document metadata', async (t) => {
  await mockFetch({ query: { pages: { 1: page, '-1': missing } } }, async () => {
    const docs = await wtf.fetch(['Example', 'Missing'])
    t.equal(docs.length, 1, 'missing pages are filtered')
    t.equal(docs[0].text(), 'hello', 'shadowed hasOwnProperty is harmless')
    t.equal(docs[0].title(), 'Example')
    t.equal(docs[0].pageID(), 1)
    t.equal(docs[0].wikidata(), 'Q12')
    t.equal(docs[0].description(), 'general greeting')
  })
  t.end()
})

test('fetch returns null for a missing page and an empty array for missing lists', async (t) => {
  await mockFetch({ query: { pages: { '-1': missing } } }, async () => {
    t.equal(await wtf.fetch('Missing'), null, 'null-prototype missing page is recognized')
    t.deepEqual(await wtf.fetch(['Missing']), [], 'no documents found')
  })
  await mockFetch({ query: { pages: {} } }, async () => {
    t.deepEqual(await wtf.fetch(['Missing']), [], 'empty API result')
  })
  t.end()
})

test('fetch preserves single and array result shapes', async (t) => {
  await mockFetch({ query: { pages: { 1: page } } }, async () => {
    const docs = await wtf.fetch([1])
    t.ok(Array.isArray(docs), 'array input returns an array')
    t.equal(docs.length, 1)
    for (const input of ['Example', 1]) {
      const doc = await wtf.fetch(input)
      t.equal(Array.isArray(doc), false, 'scalar input returns one document')
      t.equal(doc.text(), 'hello')
    }
  })
  t.end()
})
