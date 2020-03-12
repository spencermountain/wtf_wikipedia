const test = require('tape')
const wtf = require('./_lib')

test('image-methods', async function(t) {
  wtf
    .fetch('casa', 'it', {
      wiki: `wiktionary`
    })
    .then(async function(doc) {
      let img = doc.images(0)
      const bool = await img.exists()
      t.equal(bool, true, 'img exists')

      let url = img.commonsURL()
      t.ok(url, 'commons-url')

      t.end()
    })
})
