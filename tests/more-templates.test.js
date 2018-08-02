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
  t.equal(obj.redirect, 'City of Toronto', 'main');
  t.equal(obj.links[0].page, 'Municipal government of Toronto', 'list1');
  t.equal(obj.links[0].desc, 'the municipal government', 'desc1');
  t.equal(obj.links.length, 2, 'list-len');
  t.end();
});

test('templates-in-templates', t => {
  var str = `{{marriage|[[Mileva Marić]]<br>|1903|1919|end=div}}<br />{{nowrap|{{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}}<ref>{{cite book |editor-last=Heilbron |editor-first=John L. |title=The Oxford Companion to the History of Modern Science |url=https://books.google.com/books?id=abqjP-_KfzkC&pg=PA233 |date=2003 |publisher=Oxford University Press |isbn=978-0-19-974376-6 |page=233}}</ref>{{sfnp|Pais|1982|p=301}}}}`;
  var templates = wtf(str).templates();
  t.equal(templates[0].template, 'citation', 'cite-book');
  t.equal(templates[0].data.url, 'https://books.google.com/books?id=abqjP-_KfzkC&pg=PA233', 'url');
  t.equal(templates[0].data.isbn, '978-0-19-974376-6', 'isbn');
  t.equal(templates[1].template, 'marriage', 'marriage1');
  t.equal(templates[1].name, 'Elsa Löwenthal', 'marriage-1-name');
  t.equal(templates[2].template, 'sfnp', 'marriage1');
  t.equal(templates[3].template, 'marriage', 'marriage2');
  t.equal(templates[3].name, 'Mileva Marić', 'marriage2-name');
  t.end();
});
