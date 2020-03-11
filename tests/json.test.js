var test = require('tape')
var readFile = require('./lib/_cachedPage')

test('json-output-default', t => {
  var data = readFile('royal_cinema').json()
  t.ok(data.title, 'title-exists')
  t.ok(data.categories, 'categories-exists')
  t.ok(data.sections, 'sections-exists')
  t.ok(!data.images, 'images-exists')
  t.ok(!data.citations, 'citations-exists')
  t.ok(!data.infoboxes, 'infoboxes-exists')
  t.end()
})

test('json-output-options', t => {
  var options = {
    title: false,
    pageID: false,
    categories: false,
    citations: false,
    coordinates: false,
    infoboxes: false,
    images: false,
    sections: false,

    plaintext: true
  }
  var data = readFile('royal_cinema').json(options)
  t.ok(!data.title, 'title-gone')
  t.ok(!data.categories, 'categories-gone')
  t.ok(!data.citations, 'citations-gone')
  t.ok(!data.infoboxes, 'infoboxes-gone')
  t.ok(!data.images, 'images-gone')
  t.ok(!data.sections, 'sections-gone')

  t.ok(data.plaintext, 'plaintext-exists')
  t.end()
})

test('section-output', t => {
  var doc = readFile('royal_cinema')
  var data = doc.section(0).json({
    links: false,
    formatting: false,
    sentences: true
  })
  t.equal(data.depth, 0, 'depth')
  t.ok(data.sentences[0].text, 'no formatting')
  t.ok(!data.sentences[0].links, 'no formatting')
  t.ok(!data.sentences[0].formatting, 'no links')
  t.end()
})

test('sentence-output', t => {
  var doc = readFile('royal_cinema')
  var sen = doc.sentences(0)
  var data = sen.json()
  t.ok(data.text, 'text')
  t.ok(data.links, 'links')
  t.ok(data.formatting, 'formatting')

  data = sen.json({
    links: false,
    formatting: false
  })
  t.ok(data.text, 'text')
  t.ok(!data.links, 'links')
  t.ok(!data.formatting, 'formatting')
  t.end()
})
