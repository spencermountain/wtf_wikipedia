import test from 'tape'
import readFile from '../../lib/_cachedPage.js'

test('royal_cinema collections', (t) => {
  const doc = readFile('Royal-Cinema')
  t.equal(doc.images().length, 1, 'image-length')
  t.equal(doc.categories().length, 4, 'category-length')
  t.equal(doc.citations().length, 4, 'citations-length')
  t.equal(doc.infoboxes().length, 1, 'infoboxes-length')

  t.end()
})

test('other-pages', (t) => {
  const pages = [
    'Earthquakes-List',
    'United-Kingdom',
    'Chemical-Biology',
    'University-Of-Nevada-Reno-Arboretum',
    'Clint-Murchison-Sr',
    'Wendy-Mogel',
    'Damphu-Drum',
    'Direct-Representation',
    'Al-Haytham',
  ]
  pages.forEach((page) => {
    const doc = readFile(page)
    t.notEqual(doc.categories().length, 0, page + '-category-length')
    t.notEqual(doc.citations().length, 0, page + '-citations-length')
  })
  t.end()
})

