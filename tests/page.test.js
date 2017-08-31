'use strict';
var path = require('path');
var fs = require('fs');
var test = require('tape');
const wtf_wikipedia = require('../src/index');

//read cached file
var fetch = function(file) {
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
};

var findSection = function(data, title) {
  return data.sections.find(function(s) {
    return s.title === title;
  });
};

test('royal_cinema', t => {
  var data = wtf_wikipedia.parse(fetch('royal_cinema'));
  t.equal(data.infoboxes[0].data.opened.text, 1939, '');
  t.equal(data.infoboxes[0].template, 'venue', '');
  t.equal(data.sections[0].sentences.length, 10, 'sentence-length');
  t.equal(data.categories.length, 4, 'cat-length');
  t.end();
});

test('toronto_star', t => {
  var data = wtf_wikipedia.parse(fetch('toronto_star'));
  t.equal(data.infoboxes[0].data.publisher.text, 'John D. Cruickshank', '');
  t.equal(data.infoboxes[0].template, 'newspaper', '');
  var section = findSection(data, 'History');
  t.equal(section.sentences.length, 21, 'sentence-length');
  t.equal(data.categories.length, 6, 'sentence-length');
  // t.equal(data.text['Notable cartoonists'], undefined, t);
  t.end();
});

test('toronto_star with list', t => {
  var data = wtf_wikipedia.parse(fetch('toronto_star'));
  t.equal(data.infoboxes[0].data.publisher.text, 'John D. Cruickshank', '');
  t.equal(data.infoboxes[0].template, 'newspaper', '');
  var section = findSection(data, 'History');
  t.equal(section.sentences.length, 21, 'history-length');
  t.equal(data.categories.length, 6, 'cat-length');
  section = findSection(data, 'Notable cartoonists');
  t.equal(section.lists[0].length, 10, 'cartoonist-length');
  t.end();
});

test('jodie_emery', t => {
  var data = wtf_wikipedia.parse(fetch('jodie_emery'));
  t.equal(data.infoboxes[0].data.nationality.text, 'Canadian', '');
  t.equal(data.infoboxes[0].template, 'person', '');
  t.equal(data.sections[0].sentences.length >= 1, true, 'intro-length');
  t.equal(data.sections[1].sentences.length >= 1, true, 'career-length');
  t.equal(data.categories.length, 8, 'cat-length');
  t.equal(data.images.length, 1, 'image-length');
  t.end();
});

test('redirect', t => {
  var data = wtf_wikipedia.parse(fetch('redirect'));
  t.equal(data.type, 'redirect', 'is-redirect');
  t.equal(data.redirect, 'Toronto', 'redirect-place');
  // t.equal(data.infoboxes[0], undefined, t)
  // t.equal(data.infoboxes[0].template, undefined, t)
  t.end();
});

test('statoil', t => {
  var data = wtf_wikipedia.parse(fetch('statoil'));
  t.equal(data.infoboxes[0].data.namn.text, 'Statoil ASA', '');
  t.equal(data.infoboxes[0].template, 'verksemd', '');
  // (data.text.Intro.length >= 1).should.be.true;
  t.equal(data.categories.length, 4, 'cat-length');
  t.equal(data.images.length, 1, 'img-length');
  t.equal(data.images[0].file, 'Fil:Statoil-Estonia.jpg', '');
  t.equal(data.images[0].url, 'https://upload.wikimedia.org/wikipedia/commons/8/87/Statoil-Estonia.jpg', t);
  t.end();
});

test('raith rovers', t => {
  var data = wtf_wikipedia.parse(fetch('raith_rovers'));
  t.equal(data.infoboxes[0].data.clubname.text, 'Raith Rovers', '');
  t.equal(data.categories.length, 10, 'cat-length');
  t.equal(data.images.length, 2, 'img-length');
  t.equal(data.images[1].file, "File:Stark's Park - geograph.org.uk - 204446.jpg", 'img-file');
  t.equal(
    data.images[1].url,
    "https://upload.wikimedia.org/wikipedia/commons/3/38/Stark's_Park_-_geograph.org.uk_-_204446.jpg",
    'image-url'
  );
  t.end();
});
