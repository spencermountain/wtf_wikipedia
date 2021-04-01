const test = require('tape')
const wtf = require('./_lib')
const path = require('path')
const fs = require('fs')

test('image-methods', function (t) {
  let arr = [
    ['toronto', ''],
    ['United-Kingdom', '']
  ]
  arr.forEach((a) => {
    let abs = path.join(__dirname, `../../../tests/cache/${a[0]}.txt`)
    let txt = fs.readFileSync(abs).toString()
    let doc = wtf(txt)
    let img = doc.mainImage()
    t.equal(img, a[1], a[0])
  })
  t.end()
})

test('image-methods', function (t) {
  wtf
    .fetch('casa', {
      lang: 'it',
      wiki: `wiktionary`
    })
    .then(function (doc) {
      let img = doc.image(0)
      img.exists().then((bool) => {
        t.equal(bool, true, 'img exists')

        let url = img.commonsURL()
        t.ok(url, 'commons-url')

        t.end()
      })
    })
})
