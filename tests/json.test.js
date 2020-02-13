'use strict'
var test = require('tape')
var readFile = require('./lib/_cachedPage')

test('json-output-default', t => {
  var data = readFile('royal_cinema').json()
  t.ok(data.title, 'title')
  t.ok(data.categories, 'categories')
  t.ok(data.sections, 'sections')
  t.ok(!data.images, 'images')
  t.ok(!data.citations, 'citations')
  t.ok(!data.infoboxes, 'infoboxes')
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
  t.ok(!data.title, 'title')
  t.ok(!data.categories, 'categories')
  t.ok(!data.citations, 'citations')
  t.ok(!data.infoboxes, 'infoboxes')
  t.ok(!data.images, 'images')
  t.ok(!data.sections, 'sections')

  t.ok(data.plaintext, 'plaintext')
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
