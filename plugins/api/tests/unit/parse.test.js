/* eslint-disable no-console */
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

test('getHtml + getWikiscript methods exist', function (t) {
  const doc = wtf('')
  t.equal(typeof doc.getHtml, 'function', 'doc has getHtml method')
  t.equal(typeof doc.getWikiscript, 'function', 'doc has getWikiscript method')
  t.equal(typeof wtf.getHtml, 'function', 'wtf has getHtml method')
  t.equal(typeof wtf.getWikiscript, 'function', 'wtf has getWikiscript method')
  t.end()
})

test('getHtml hits the parse endpoint and returns html', async function (t) {
  const res = { parse: { title: 'Toronto', text: '<p>hello</p>' } }
  await mockHttp(res, async (urls) => {
    const html = await wtf.getHtml('Toronto', { lang: 'fr' })
    t.equal(html, '<p>hello</p>', 'returns rendered html')
    t.ok(/fr\.wikipedia\.org/.test(urls[0]), 'respects lang option')
    t.ok(/action=parse/.test(urls[0]), 'uses parse action')
    t.ok(/prop=text/.test(urls[0]), 'asks for html')
    t.ok(/page=Toronto/.test(urls[0]), 'passes page title')
  })
  t.end()
})

test('getWikiscript returns the raw markup', async function (t) {
  const res = { parse: { title: 'Toronto', wikitext: '==hello==' } }
  await mockHttp(res, async (urls) => {
    const wiki = await wtf.getWikiscript('Toronto')
    t.equal(wiki, '==hello==', 'returns wikitext')
    t.ok(/prop=wikitext/.test(urls[0]), 'asks for wikitext')
  })
  t.end()
})

test('silent option suppresses console warnings', async function (t) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => ({ ok: false, status: 429 })
  const warns = []
  const originalWarn = console.warn
  console.warn = (...args) => warns.push(args)
  const res = await wtf.getHtml('Toronto', { silent: true })
  const loud = await wtf.getHtml('Toronto')
  console.warn = originalWarn
  globalThis.fetch = originalFetch
  t.equal(res, null, 'failure still resolves null')
  t.equal(loud, null, 'failure still resolves null')
  t.equal(warns.length, 1, 'only the non-silent call warned')
  t.end()
})

test('parse methods resolve null on a missing page', async function (t) {
  const res = { error: { code: 'missingtitle', info: 'The page you specified doesn\'t exist.' } }
  await mockHttp(res, async () => {
    t.equal(await wtf.getHtml('Not A Real Page zzz'), null, 'getHtml null')
    t.equal(await wtf.getWikiscript('Not A Real Page zzz'), null, 'getWikiscript null')
  })
  t.end()
})
