const test = require('tape')
const readFile = require('../lib/_cachedPage')

test('royal_cinema page', (t) => {
  const doc = readFile('royal_cinema')
  t.equal(doc.infobox().template(), 'venue', 'venue template')
  t.equal(doc.section().sentences().length, 10, 'sentence-length')
  t.equal(doc.categories().length, 4, 'cat-length')

  t.equal(doc.infobox().get('opened').text(), '1939', 'year-string')
  // t.equal(doc.infobox().keyValue()['opened'], 1939, 'year-number');
  t.end()
})

test('toronto_star page', (t) => {
  const doc = readFile('toronto_star')
  t.equal(doc.infobox().data.publisher.text(), 'John D. Cruickshank', 'publisher.text')
  t.equal(doc.infobox().template(), 'newspaper', 'newspaper template')
  const section = doc.section('history')
  t.equal(section.sentences().length, 21, 'sentence-length')
  t.equal(doc.categories().length, 6, 'sentence-length')
  // t.equal(doc.text['Notable cartoonists'], undefined, t);
  t.end()
})

test('toronto_star with list', (t) => {
  const doc = readFile('toronto_star')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.isDisambig(), false, 'not-disambig')
  t.equal(doc.infobox().data.publisher.text(), 'John D. Cruickshank', 'publisher.text')
  t.equal(doc.infobox().template(), 'newspaper', 'newspaper template')
  let section = doc.section('history')
  t.equal(section.sentences().length, 21, 'history-length')
  t.equal(doc.categories().length, 6, 'cat-length')
  section = doc.section('Notable cartoonists')
  t.equal(section.list().json().length, 10, 'cartoonist-length')
  t.end()
})

test('jodie_emery', (t) => {
  const doc = readFile('jodie_emery')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infobox().data.nationality.text(), 'Canadian', 'nationality')
  t.equal(doc.infobox().template(), 'person', 'person template')
  t.equal(doc.section().sentences().length >= 1, true, 'intro-length')
  t.equal(doc.section(1).sentences().length >= 1, true, 'career-length')
  t.equal(doc.categories().length, 8, 'cat-length')
  t.equal(doc.images().length, 1, 'image-length')
  t.end()
})

test('statoil', (t) => {
  const doc = readFile('statoil')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infobox().data.namn.text(), 'Statoil ASA', 'name')
  t.equal(doc.infobox().type(), 'verksemd', 'template')
  // (doc.text.Intro.length >= 1).should.be.true;
  t.equal(doc.categories().length, 4, 'cat-length')
  t.equal(doc.images().length, 1, 'img-length')
  t.equal(doc.image().file(), 'File:Statoil-Estonia.jpg', 'file')
  t.equal(doc.image().url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Statoil-Estonia.jpg', t)
  t.end()
})

test('raith rovers', (t) => {
  const doc = readFile('raith_rovers')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infobox(0).data.clubname.text(), 'Raith Rovers', 'clubname')
  t.equal(doc.categories().length, 10, 'cat-length')
  t.equal(doc.images().length, 2, 'img-length')
  t.equal(doc.image(1).file(), "File:Stark's_Park_-_geograph.org.uk_-_204446.jpg", 'img-file')
  t.equal(
    doc.image(1).url(),
    `https://wikipedia.org/wiki/Special:Redirect/file/Stark's_Park_-_geograph.org.uk_-_204446.jpg`,
    'image-url'
  )
  t.end()
})

test('mark behr', (t) => {
  const doc = readFile('Mark-Behr')
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infoboxes().length, 1, 'got infobox')
  t.equal(doc.categories().length, 3, 'cat-length')
  let s = doc.section('publikasies')
  t.equal(s.tables().length, 1, 'got table')
  t.equal(doc.table().links().length, 0, 'table has no links')
  t.equal(s.lists().length, 0, 'no list')
  s = doc.section('toekennings')
  t.equal(s.lists().length, 1, 'got list')
  t.equal(s.list().lines().length, 4, 'got 4 items in list')
  t.end()
})
