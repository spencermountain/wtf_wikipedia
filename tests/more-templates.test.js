'use strict';
var test = require('tape');
var wtf = require('./lib');

test('imdb', t => {
  let str = `{{IMDb title | 0426883 | Alpha Dog }}`;
  var doc = wtf(str);
  let obj = doc.templates(0);
  t.equal(obj.template, 'imdb title', 'imdb');
  t.equal(obj.id, '0426883', 'id1');
  t.equal(obj.title, 'Alpha Dog', 'title');

  str = `{{IMDb title | id= 0426883 | title= Alpha Dog }}`;
  doc = wtf(str);
  obj = doc.templates(0);
  t.equal(obj.id, '0426883', 'id1');
  t.equal(obj.title, 'Alpha Dog', 'title');
  t.end();
});
