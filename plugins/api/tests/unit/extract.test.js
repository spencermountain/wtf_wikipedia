import test from 'tape'
import wtf from '../_lib.js'

// swap globalThis.fetch for one stubbed json response, capturing request urls
const mockHttp = async (response, run) => {
  const original = globalThis.fetch
  const urls = []
  globalThis.fetch = async (url) => {
    urls.push(String(url))
    return { ok: true, json: async () => response }
  }
  try {
    await run(urls)
  } finally {
    globalThis.fetch = original
  }
}

test('getExtract methods exist', function (t) {
  const doc = wtf('')
  t.equal(typeof doc.getExtract, 'function', 'doc has getExtract method')
  t.equal(typeof wtf.getExtract, 'function', 'wtf has getExtract method')
  t.end()
})

test('getExtract hits the TextExtracts endpoint', async function (t) {
  const res = { query: { pages: [{ pageid: 1, title: 'Toronto', extract: 'Toronto is a city.' }] } }
  await mockHttp(res, async (urls) => {
    const text = await wtf.getExtract('Toronto', { lang: 'fr' })
    t.equal(text, 'Toronto is a city.', 'returns the plaintext extract')
    t.ok(/fr\.wikipedia\.org/.test(urls[0]), 'respects lang option')
    t.ok(/action=query/.test(urls[0]), 'uses query action')
    t.ok(/prop=extracts/.test(urls[0]), 'asks for extracts')
    t.ok(/explaintext=1/.test(urls[0]), 'asks for plaintext')
    t.ok(/exsectionformat=wiki/.test(urls[0]), "defaults to 'wiki' section format")
    t.ok(/titles=Toronto/.test(urls[0]), 'passes page title')
  })
  t.end()
})

test('getExtract sections option sets exsectionformat', async function (t) {
  const res = { query: { pages: [{ pageid: 1, title: 'Toronto', extract: 'hi' }] } }
  await mockHttp(res, async (urls) => {
    await wtf.getExtract('Toronto', { sections: 'plain' })
    t.ok(/exsectionformat=plain/.test(urls[0]), 'plain is passed-through')
    await wtf.getExtract('Toronto', { sections: 'shouty' })
    t.ok(/exsectionformat=wiki/.test(urls[1]), 'junk values fall back to wiki')
  })
  t.end()
})

test('getExtract rebuilds the api host from fetched-doc options', async function (t) {
  const res = { query: { pages: [{ pageid: 1, title: 'Toronto', extract: 'hi' }] } }
  await mockHttp(res, async (urls) => {
    // a fetched doc's options() hold a bare project domain + the wrong path
    await wtf.getExtract('Toronto', { lang: 'fr', domain: 'wikipedia.org', path: 'api.php' })
    t.ok(urls[0].startsWith('https://fr.wikipedia.org/w/api.php?'), 'bare project domain gets lang + w/api.php')
    await wtf.getExtract('Miss Piggy', { domain: 'muppet.fandom.com', path: 'api.php' })
    t.ok(urls[1].startsWith('https://muppet.fandom.com/api.php?'), '3rd-party domain + path kept as-is')
  })
  t.end()
})

test('getExtract resolves null on a missing page', async function (t) {
  const res = { query: { pages: [{ ns: 0, title: 'Missing', missing: true }] } }
  await mockHttp(res, async () => {
    t.equal(await wtf.getExtract('Missing'), null, 'missing page gives null')
  })
  t.end()
})
