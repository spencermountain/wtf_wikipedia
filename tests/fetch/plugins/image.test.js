import test from 'tape'
import wtf from '../../../plugins/image/tests/_lib.js'

test('image-methods', async (t) => {
  const doc = await wtf.fetch('casa', { lang: 'it', wiki: 'wiktionary' })
  const img = doc.image(0)
  t.equal(await img.exists(), true, 'img exists')
  t.ok(img.commonsURL(), 'commons-url')
  t.end()
})
