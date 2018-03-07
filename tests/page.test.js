'use strict';
var path = require('path');
var fs = require('fs');
var test = require('tape');
var wtf = require('./lib');

//read cached file
var readFile = function(file) {
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
};

test('royal_cinema', t => {
  var doc = wtf(readFile('royal_cinema'));
  t.equal(doc.infoboxes(0).data.opened.text(), 1939, 'opened');
  t.equal(doc.infoboxes(0).template, 'venue', '');
  t.equal(doc.sections(0).sentences().length, 10, 'sentence-length');
  t.equal(doc.categories().length, 4, 'cat-length');
  t.end();
});

test('toronto_star', t => {
  var doc = wtf(readFile('toronto_star'));
  t.equal(doc.infoboxes(0).data.publisher.text(), 'John D. Cruickshank', 'publisher.text');
  t.equal(doc.infoboxes(0).template, 'newspaper', '');
  var section = doc.sections('history');
  t.equal(section.sentences().length, 21, 'sentence-length');
  t.equal(doc.categories().length, 6, 'sentence-length');
  // t.equal(doc.text['Notable cartoonists'], undefined, t);
  t.end();
});

test('toronto_star with list', t => {
  var doc = wtf(readFile('toronto_star'));
  t.equal(doc.infoboxes(0).data.publisher.text(), 'John D. Cruickshank', 'publisher.text');
  t.equal(doc.infoboxes(0).template, 'newspaper', '');
  var section = doc.sections('history');
  t.equal(section.sentences().length, 21, 'history-length');
  t.equal(doc.categories().length, 6, 'cat-length');
  section = doc.sections('Notable cartoonists');
  t.equal(section.lists(0).length, 10, 'cartoonist-length');
  t.end();
});

test('jodie_emery', t => {
  var doc = wtf(readFile('jodie_emery'));
  t.equal(doc.infoboxes(0).data.nationality.text(), 'Canadian', '');
  t.equal(doc.infoboxes(0).template, 'person', '');
  t.equal(doc.sections(0).sentences.length >= 1, true, 'intro-length');
  t.equal(doc.sections(1).sentences.length >= 1, true, 'career-length');
  t.equal(doc.categories().length, 8, 'cat-length');
  t.equal(doc.images().length, 1, 'image-length');
  t.end();
});

test('redirect', t => {
  var doc = wtf(readFile('redirect'));
  t.equal(doc.isRedirect(), true, 'is-redirect');
  t.equal(doc.links(0).page, 'Toronto', 'redirect-place');
  t.equal(doc.infoboxes(0), undefined, t);
  // t.equal(doc.infoboxes(0).template, undefined, t)
  t.end();
});

test('statoil', t => {
  var doc = wtf(readFile('statoil'));
  t.equal(doc.infoboxes(0).data.namn.text(), 'Statoil ASA', 'name');
  t.equal(doc.infoboxes(0).template, 'verksemd', 'template');
  // (doc.text.Intro.length >= 1).should.be.true;
  t.equal(doc.categories().length, 4, 'cat-length');
  t.equal(doc.images().length, 1, 'img-length');
  t.equal(doc.images(0).file, 'Fil:Statoil-Estonia.jpg', '');
  t.equal(doc.images(0).url(), 'https://upload.wikimedia.org/wikipedia/commons/8/87/Statoil-Estonia.jpg', t);
  t.end();
});

test('raith rovers', t => {
  var doc = wtf(readFile('raith_rovers'));
  t.equal(doc.infoboxes(0).data.clubname.text(), 'Raith Rovers', '');
  t.equal(doc.categories().length, 10, 'cat-length');
  t.equal(doc.images().length, 2, 'img-length');
  t.equal(doc.images(1).file, 'File:Stark\'s Park - geograph.org.uk - 204446.jpg', 'img-file');
  t.equal(
    doc.images(1).url(),
    'https://upload.wikimedia.org/wikipedia/commons/3/38/Stark\'s_Park_-_geograph.org.uk_-_204446.jpg',
    'image-url'
  );
  t.end();
});
