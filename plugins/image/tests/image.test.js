import test from 'tape'
import wtf from './_lib.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))

test('mainImage', function (t) {
  let arr = [
    ['toronto', 'https://wikipedia.org/wiki/Special:Redirect/file/Montage_of_Toronto_7.jpg'],
    [
      'United-Kingdom',
      'https://wikipedia.org/wiki/Special:Redirect/file/Flag_of_the_United_Kingdom.svg',
    ],
    ['Allen-R.-Morris', 'https://wikipedia.org/wiki/Special:Redirect/file/AllenMorrisHeadShot.jpg'],
    [
      'Arts_Club_of_Chicago',
      'https://wikipedia.org/wiki/Special:Redirect/file/20070701_Arts_Club_of_Chicago.JPG',
    ],
    ['Britt-Morgan', 'https://wikipedia.org/wiki/Special:Redirect/file/Britt_Morgan.jpg'],
    // ['', '']
  ]
  arr.forEach((a) => {
    let abs = path.join(dir, `../../../tests/cache/${a[0]}.txt`)
    let txt = fs.readFileSync(abs).toString()
    let doc = wtf(txt)
    let img = doc.mainImage().src()
    t.equal(img, a[1], a[0])
  })
  t.end()
})

test('image-methods', function (t) {
  wtf
    .fetch('casa', {
      lang: 'it',
      wiki: `wiktionary`,
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
