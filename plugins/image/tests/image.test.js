import { readPage } from '../../../tests/_examples/index.js'
import test from 'tape'
import wtf from './_lib.js'

test('mainImage', function (t) {
  const arr = [
    ['Toronto', 'https://wikipedia.org/wiki/Special:Redirect/file/Montage_of_Toronto_7.jpg'],
    ['United-Kingdom', 'https://wikipedia.org/wiki/Special:Redirect/file/Flag_of_the_United_Kingdom.svg'],
    ['Allen-R-Morris', 'https://wikipedia.org/wiki/Special:Redirect/file/AllenMorrisHeadShot.jpg'],
    ['Arts-Club-Of-Chicago', 'https://wikipedia.org/wiki/Special:Redirect/file/20070701_Arts_Club_of_Chicago.JPG'],
    ['Britt-Morgan', 'https://wikipedia.org/wiki/Special:Redirect/file/Britt_Morgan.jpg'],
    // ['', '']
  ]
  arr.forEach((a) => {
    const txt = readPage(a[0])
    const doc = wtf(txt)
    const img = doc.mainImage().src()
    t.equal(img, a[1], a[0])
  })
  t.end()
})

test('link-to-file', (t) => {
  const doc = wtf(`pre [[:File:pagename]] post`)
  t.equal(doc.links().length, 1, 'found one link')
  t.equal(doc.text(), 'pre File:pagename post', 'found text')
  t.equal(doc.images().length, 0, 'found no images')
  t.end()
})
