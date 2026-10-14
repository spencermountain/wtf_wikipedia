import test from 'tape'
import assert from 'node:assert/strict'
import wtf from '../lib/index.js'

test('fetch-as-promise', async (t) => {
  t.plan(8)
  const doc = await wtf.fetch('Tony Hawk', {
    lang: 'en',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.sections().length > 0, 'promise returned document')
  t.equal(doc.language(), 'en')
  t.equal(doc.title(), 'Tony Hawk')
  t.equal(doc.pageID(), 87474)
  t.equal(doc.wikidata(), 'Q295020')
  t.notEqual(doc.revisionID(), null)
  t.notEqual(doc.timestamp(), null)
  t.notEqual(doc.description(), null)
})

test('promise rejects on error if no callback', async (t) => {
  await assert.rejects(wtf.fetch('https://example.com', 'en'), { name: 'Error', message: /^HTTP \d+/ })
  t.pass('request rejects with an HTTP error')

  t.end()
})

test("if callback supplied, error scenario calls errback and doesn't reject promise", async (t) => {
  t.plan(3)
  await wtf.fetch('https://example.com', 'en', (err, data) => {
    t.equal(data, null)
    t.equal(err.name, 'Error')
    t.match(err.message, /^HTTP \d+/)
  })

  t.end()
})

test('fetch-invalid', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('Taylor%20Swift', {
    lang: 'en',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc === null, 'invalid character query returns null')
})

test('fetch-missing', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('NonExistentPage', {
    lang: 'en',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc === null, 'fetching non-existent page returns null')
})

test('fetch-redirect', async (t) => {
  t.plan(1)
  const doc = await wtf.fetch('USA', {
    lang: 'simple',
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  t.ok(doc.isRedirect(), 'got redirect')
})

test('ambiguous-pageids', async function (t) {
  const doc = await wtf.fetch(1984, 'en')
  t.equal(doc.title(), 'Arab world', 'input as pageid')

  let docs = await wtf.fetch([2983, 7493], 'en')
  t.equal(docs.length, 2, 'got two pageid results')
  t.equal(docs[0].title(), 'Austria-Hungary', 'first pageid')
  t.equal(docs[1].title(), 'Talk:P versus NP problem/Archive 1', 'second pageid')

  docs = await wtf.fetch(['June', 'July'], 'en')
  t.equal(docs.length, 2, 'got two results')
  t.equal(docs[0].title(), 'June', 'input as text')
  t.equal(docs[1].title(), 'July', 'input as text')
  t.end()
})

test('intensive', async (t) => {
  /* fires a bunch of requests in parallel - this should be enough to get blocked by wikipedia if the user agent is not set correctly */
  const pages = [
    'Mouse',
    'Rat',
    'Porcupine',
    'Chipmunk',
    'Vole',
  ]
  t.plan(pages.length)
  const promises = pages.map((page) =>
    wtf.fetch(page, {
      lang: 'en',
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
  )
  const results = await Promise.all(promises)
  results.forEach((result) => {
    t.ok(result.title(), 'got a page')
  })
})
