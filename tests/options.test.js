'use strict';
var path = require('path');
var fs = require('fs');
var test = require('tape');
var wtf_wikipedia = require('./lib');

//read cached file
var fetch = function(file) {
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
};

test('royal_cinema', t => {
  var txt = fetch('royal_cinema');
  var data = wtf_wikipedia.parse(txt);
  t.equal(data.images.length, 1, 'image-length');
  t.equal(data.categories.length, 4, 'category-length');
  t.equal(data.citations.length, 4, 'citations-length');
  t.equal(data.infoboxes.length, 1, 'infoboxes-length');

  data = wtf_wikipedia.parse(txt, {
    categories: false,
    citations: false,
    images: false,
    infoboxes: false
  });
  t.equal(data.images.length, 0, 'post-image-length');
  t.equal(data.categories.length, 0, 'post-category-length');
  t.equal(data.citations.length, 0, 'post-citations-length');
  t.equal(data.infoboxes.length, 0, 'post-infoboxes-length');
  t.end();
});

test('other-pages', t => {
  var pages = [
    'earthquakes',
    'United-Kingdom',
    'Chemical-biology',
    'University-of-Nevada,-Reno-Arboretum',
    'Clint-Murchison-Sr.',
    'Wendy-Mogel',
    'Damphu-drum',
    'africaans',
    'Direct-representation',
    'al_Haytham',
  ];
  pages.forEach((page) => {
    var txt = fetch(page);
    var data = wtf_wikipedia.parse(txt);
    data = wtf_wikipedia.parse(txt, {
      categories: false,
      citations: false,
      images: false,
      infoboxes: false
    });
    t.equal(data.images.length, 0, page + '-image-length');
    t.equal(data.categories.length, 0, page + '-category-length');
    t.equal(data.citations.length, 0, page + '-citations-length');
    t.equal(data.infoboxes.length, 0, page + '-infoboxes-length');
  });
  t.end();
});
