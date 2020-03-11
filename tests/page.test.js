var test = require('tape')
var readFile = require('./lib/_cachedPage')

test('royal_cinema page', t => {
  var doc = readFile('royal_cinema')
  t.equal(doc.infoboxes(0).template(), 'venue', 'venue template')
  t.equal(doc.sections(0).sentences().length, 10, 'sentence-length')
  t.equal(doc.categories().length, 4, 'cat-length')

  t.equal(
    doc
      .infoboxes(0)
      .get('opened')
      .text(),
    '1939',
    'year-string'
  )
  // t.equal(doc.infoboxes(0).keyValue()['opened'], 1939, 'year-number');
  t.end()
})

test('toronto_star page', t => {
  var doc = readFile('toronto_star')
  t.equal(doc.infoboxes(0).data.publisher.text(), 'John D. Cruickshank', 'publisher.text')
  t.equal(doc.infoboxes(0).template(), 'newspaper', 'newspaper template')
  var section = doc.sections('history')
  t.equal(section.sentences().length, 21, 'sentence-length')
  t.equal(doc.categories().length, 6, 'sentence-length')
  // t.equal(doc.text['Notable cartoonists'], undefined, t);
  t.end()
})

test('toronto_star with list', t => {
  var doc = readFile('toronto_star')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.isDisambig(), false, 'not-disambig')
  t.equal(doc.infoboxes(0).data.publisher.text(), 'John D. Cruickshank', 'publisher.text')
  t.equal(doc.infoboxes(0).template(), 'newspaper', 'newspaper template')
  var section = doc.sections('history')
  t.equal(section.sentences().length, 21, 'history-length')
  t.equal(doc.categories().length, 6, 'cat-length')
  section = doc.sections('Notable cartoonists')
  t.equal(section.lists(0).json().length, 10, 'cartoonist-length')
  t.end()
})

test('jodie_emery', t => {
  var doc = readFile('jodie_emery')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infoboxes(0).data.nationality.text(), 'Canadian', 'nationality')
  t.equal(doc.infoboxes(0).template(), 'person', 'person template')
  t.equal(doc.sections(0).sentences.length >= 1, true, 'intro-length')
  t.equal(doc.sections(1).sentences.length >= 1, true, 'career-length')
  t.equal(doc.categories().length, 8, 'cat-length')
  t.equal(doc.images().length, 1, 'image-length')
  t.end()
})

test('statoil', t => {
  var doc = readFile('statoil')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infoboxes(0).data.namn.text(), 'Statoil ASA', 'name')
  t.equal(doc.infoboxes(0).type(), 'verksemd', 'template')
  // (doc.text.Intro.length >= 1).should.be.true;
  t.equal(doc.categories().length, 4, 'cat-length')
  t.equal(doc.images().length, 1, 'img-length')
  t.equal(doc.images(0).file(), 'Fil:Statoil-Estonia.jpg', 'file')
  t.equal(doc.images(0).url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Statoil-Estonia.jpg', t)
  t.end()
})

test('raith rovers', t => {
  var doc = readFile('raith_rovers')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infoboxes(0).data.clubname.text(), 'Raith Rovers', 'clubname')
  t.equal(doc.categories().length, 10, 'cat-length')
  t.equal(doc.images().length, 2, 'img-length')
  t.equal(doc.images(1).file(), "File:Stark's Park - geograph.org.uk - 204446.jpg", 'img-file')
  t.equal(
    doc.images(1).url(),
    `https://wikipedia.org/wiki/Special:Redirect/file/Stark's_Park_-_geograph.org.uk_-_204446.jpg`,
    'image-url'
  )
  t.end()
})

test('mark behr', t => {
  var doc = readFile('Mark-Behr')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infoboxes().length, 1, 'got infobox')
  t.equal(doc.categories().length, 3, 'cat-length')
  var s = doc.sections('publikasies')
  t.equal(s.tables().length, 1, 'got table')
  t.equal(doc.tables(0).links().length, 0, 'table has no links')
  t.equal(s.lists().length, 0, 'no list')
  s = doc.sections('toekennings')
  t.equal(s.lists().length, 1, 'got list')
  t.equal(s.lists(0).lines().length, 4, 'got 4 items in list')
  t.end()
})
