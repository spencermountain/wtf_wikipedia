'use strict';
var test = require('tape');
var wtf = require('./lib');

test('imdb', t => {
  var str = `{{IMDb title | 0426883 | Alpha Dog }}`;
  var doc = wtf(str);
  var obj = doc.templates(0);
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

test('taxon', t => {
  var str = `{{Taxon info|Felis|parent}}`;
  var doc = wtf(str);
  var obj = doc.templates(0);
  t.equal(obj.taxon, 'Felis', 'taxon');
  t.end();
});

test('generic-list', t => {
  var str = `{{Portal bar|portal 1|portal 2}}`;
  var doc = wtf(str);
  var obj = doc.templates(0);
  console.log(obj);
  t.equal(obj.template, 'portal bar', 'name');
  t.equal(obj.data[0], 'portal 1', 'list1');
  t.equal(obj.data[1], 'portal 2', 'list2');
  t.equal(obj.data.length, 2, 'list-len');
  t.end();
});

test('redirect-list', t => {
  var str = `{{Redirect|City of Toronto|the municipal government|Municipal government of Toronto|the historical part of the city prior to the 1998 amalgamation|Old Toronto}}`;
  var doc = wtf(str);
  var obj = doc.templates(0);
  t.equal(obj.template, 'redirect', 'name');
  t.equal(obj.data[0], 'City of Toronto', 'list1');
  // t.equal(obj.list.length, 2, 'list-len');
  t.end();
});
