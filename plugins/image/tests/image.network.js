import test from 'tape'
import wtf from './_lib.js'

test('image-methods', function (t) {
  wtf
    .fetch('casa', {
      lang: 'it',
      wiki: `wiktionary`
    })
    .then(function (doc) {
      const img = doc.image(0)
      img.exists().then((bool) => {
        t.equal(bool, true, 'img exists')

        const url = img.commonsURL()
        t.ok(url, 'commons-url')

        t.end()
      })
    })
})
