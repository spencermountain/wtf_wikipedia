var test = require('tape')
var readFile = require('./lib/_cachedPage')

test('royal_cinema options', t => {
  var doc = readFile('royal_cinema')
  t.equal(doc.images().length, 1, 'image-length')
  t.equal(doc.categories().length, 4, 'category-length')
  t.equal(doc.citations().length, 4, 'citations-length')
  t.equal(doc.infoboxes().length, 1, 'infoboxes-length')

  let data = readFile('royal_cinema').json({
    categories: false,
    citations: false,
    images: false,
    infoboxes: false
  })
  t.equal(data.images, undefined, 'post-image-length')
  t.equal(data.categories, undefined, 'post-category-length')
  t.equal(data.citations, undefined, 'post-citations-length')
  t.equal(data.infoboxes, undefined, 'post-infoboxes-length')
  t.end()
})

test('other-pages', t => {
  var pages = [
    'earthquakes',
    'United-Kingdom',
    'Chemical-biology',
    'University-of-Nevada,-Reno-Arboretum',
    'Clint-Murchison-Sr.',
    'Wendy-Mogel',
    'Damphu-drum',
    'Direct-representation',
    'al_Haytham'
  ]
  pages.forEach(page => {
    var doc = readFile(page)
    t.notEqual(doc.categories().length, 0, page + '-category-length')
    t.notEqual(doc.citations().length, 0, page + '-citations-length')
  })
  t.end()
})

test('turn all options off', t => {
  var options = {
    sections: false,
    paragraphs: false,
    sentences: false,
    title: false,
    categories: false,
    coordinates: false,
    infoboxes: false,
    pageID: false
  }
  var doc = readFile('United-Kingdom')
  var out = JSON.stringify(doc.json(options))
  t.equal(out, '{}', 'json empty')

  t.end()
})
