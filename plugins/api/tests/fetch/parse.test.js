import test from 'tape'
import wtf from '../_lib.js'

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
}

test('getHtml', async (t) => {
  t.plan(2)
  const html = await wtf.getHtml('Royal Cinema', opts)
  t.ok(/mw-parser-output/.test(html || ''), 'got rendered html')
  const missing = await wtf.getHtml('Zzqxv is not a real page', opts)
  t.equal(missing, null, 'missing page is null')
})

test('getWikiscript', async (t) => {
  t.plan(1)
  const wiki = await wtf.getWikiscript('Royal Cinema', opts)
  t.ok(/\{\{/.test(wiki || ''), 'got raw wikitext')
})

test('getExtract', async (t) => {
  t.plan(3)
  const text = await wtf.getExtract('Royal Cinema', opts)
  t.ok(text !== null && text.length > 200, 'got plaintext')
  t.ok(/==/.test(text), `default 'wiki' format keeps == heading == lines`)
  const plain = await wtf.getExtract('Royal Cinema', { ...opts, sections: 'plain' })
  t.equal(/==/.test(plain || ''), false, `'plain' format drops them`)
})

test('parse methods on a fetched doc', async (t) => {
  t.plan(2)
  const doc = await wtf.fetch('Royal Cinema', opts)
  const html = await doc.getHtml()
  t.ok(/mw-parser-output/.test(html || ''), 'doc.getHtml resolves html')
  const text = await doc.getExtract({ ...opts, sections: 'plain' })
  t.ok(text !== null && text.length > 200, 'doc.getExtract resolves plaintext')
})
