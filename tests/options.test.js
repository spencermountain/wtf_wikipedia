'use strict';
var test = require('tape');
var readFile = require('./lib/_cachedPage');

test('royal_cinema', t => {
  var doc = readFile('royal_cinema');
  t.equal(doc.images().length, 1, 'image-length');
  t.equal(doc.categories().length, 4, 'category-length');
  t.equal(doc.citations().length, 4, 'citations-length');
  t.equal(doc.infoboxes().length, 1, 'infoboxes-length');

  // doc = readFile('royal_cinema', {
  //   categories: false,
  //   citations: false,
  //   images: false,
  //   infoboxes: false
  // });
  // t.equal(doc.images().length, 0, 'post-image-length');
  // t.equal(doc.categories().length, 0, 'post-category-length');
  // t.equal(doc.citations().length, 0, 'post-citations-length');
  // t.equal(doc.infoboxes().length, 0, 'post-infoboxes-length');
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
    'Direct-representation',
    'al_Haytham',
  ];
  pages.forEach((page) => {
    var doc = readFile(page);
    t.notEqual(doc.categories().length, 0, page + '-category-length');
    t.notEqual(doc.citations().length, 0, page + '-citations-length');
  });
  t.end();
});



test('turn all options off', t => {
  let options = {
    sections: false,
    paragraphs: false,
    sentences: false,
    title: false,
    categories: false,
    coordinates: false,
    pageID: false
  };
  var doc = readFile('United-Kingdom');
  let out = JSON.stringify(doc.json(options));
  t.equal(out, '{}', 'json empty');

  let html = doc.html(options);
  t.ok(html.length < 100, 'html empty');

  let md = doc.markdown(options);
  t.equal(md, '', 'markdown empty');

  let latex = doc.latex(options);
  t.equal(latex, '', 'latex empty');

  t.end();
});
