import test from 'tape'
import wtf from '../lib/index.js'

test('get metadata', async (t) => {
  t.plan(2)
  const doc = await wtf.fetch('Toronto Raptors', {
    lang: 'en',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.equal(doc.pageID, 72879, 'got wikipedia id')
  t.equal(doc.wikidata, 'Q132880', 'got wikidata id')
})
