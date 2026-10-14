import test from 'tape'
import wtf from '../lib/index.js'

test('3rd-party image bulbapedia', async (t) => {
  const doc = await wtf.fetch('https://bulbapedia.bulbagarden.net/wiki/Aegislash_(Pok%C3%A9mon)', { path: 'w/api.php' })
  t.equal(doc.domain(), 'bulbapedia.bulbagarden.net', 'got domain from url input')
  const urls = doc.images().map((image) => image.url())
  t.ok(urls.length > 2, 'got urls')
  t.match(urls[0], /bulbapedia\.bulbagarden\.net/, '3rd-party image url')
  t.end()
})
