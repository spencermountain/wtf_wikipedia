import test from 'tape'
import wtf from '../lib/index.js'

test('fetch-as-promise', (t) => {
  t.plan(8)
  const p = wtf.fetch('Tony Hawk', {
    lang: 'en',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  p.then(function (doc) {
    t.ok(doc.sections().length > 0, 'promise returned document')
    t.equal(doc.language(), 'en')
    t.equal(doc.title(), 'Tony Hawk')
    t.equal(doc.pageID(), 87474)
    t.equal(doc.wikidata(), 'Q295020')
    t.notEqual(doc.revisionID(), null)
    t.notEqual(doc.timestamp(), null)
    t.notEqual(doc.description(), null)
  })
  p.catch(function (e) {
    t.throws(e)
  })
})

test('promise rejects on error if no callback', async (t) => {
  let err

  try {
    await wtf.fetch('https://example.com', 'en')
  } catch (e) {
    err = e
  }

  // a non-api url will respond with a http error
  t.equal(err.name, 'Error')
  t.match(err.message, /^HTTP \d+/)

  t.end()
})

test("if callback supplied, error scenario calls errback and doesn't reject promise", async (t) => {
  await wtf.fetch('https://example.com', 'en', (err, data) => {
    t.equal(data, null)
    // a non-api url will respond with a http error
    t.equal(err.name, 'Error')
    t.match(err.message, /^HTTP \d+/)
  })

  t.end()
})

// test('fetch-as-callback', (t) => {
//   t.plan(1)
//   wtf.fetch('Tony Danza', 'en', function (err, doc) {
//     if (err) {
//       t.throws(err)
//     }
//     t.ok(doc.categories().length > 0, 'callback returned document')
//   })
// })

test('fetch-invalid', (t) => {
  t.plan(1)
  const p = wtf.fetch('Taylor%20Swift', {
    lang: 'en',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  p.then(function (doc) {
    t.ok(doc === null, 'invalid character query returns null')
  })
  p.catch(function (e) {
    t.throws(e)
  })
})

test('fetch-missing', (t) => {
  t.plan(1)
  const p = wtf.fetch('NonExistentPage', {
    lang: 'en',
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  p.then(function (doc) {
    t.ok(doc === null, 'fetching non-existent page returns null')
  })
  p.catch(function (e) {
    t.throws(e)
  })
})

test('fetch-redirect', (t) => {
  t.plan(1)
  const p = wtf.fetch('USA', {
    lang: 'simple',
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  p.then(function (doc) {
    t.ok(doc.isRedirect(), 'got redirect')
  })
  p.catch(function (e) {
    t.throws(e)
  })
})

//uncomment for testing on node>6
test('ambiguous-pageids', async function (t) {
  let doc = await wtf.fetch(1984, 'en')
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

test('intensive', (t) => {
  /* fires a bunch of requests in parallel - this should be enough to get blocked by wikipedia if the user agent is not set correctly */
  const pages = [
    'Mouse',
    'Rat',
    'Porcupine',
    'Chipmunk',
    'Vole',
    // 'Chinchilla',
    // 'Gopher',
    // 'Capybara',
    // 'Beaver',
    // 'Hamster',
  ]
  t.plan(pages.length)
  const promises = pages.map((page) =>
    wtf.fetch(page, {
      lang: 'en',
      'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
  )
  Promise.all(promises)  
    .then((results) => {
      results.forEach((result) => {
        t.ok(result.title(), 'got a page')
      })
      t.end()
    })
    .catch((e) => {
      t.error(e, e)
    })
})
