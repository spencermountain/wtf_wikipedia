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
  var ref = wtf(str).citations(0);
  var templates = wtf(str).templates();
  t.equal(ref.template, 'citation', 'cite-book');
  t.equal(ref.data.url, 'https://books.google.com/books?id=abqjP-_KfzkC&pg=PA233', 'url');
  t.equal(ref.data.isbn, '978-0-19-974376-6', 'isbn');
  t.equal(templates[0].template, 'marriage', 'marriage1');
  t.equal(templates[0].name, 'Elsa Löwenthal', 'marriage-1-name');
  t.equal(templates[1].template, 'sfnp', 'sfnp');
  t.equal(templates[2].template, 'marriage', 'marriage2');
  t.equal(templates[2].name, 'Mileva Marić', 'marriage2-name');
  t.end();
});

test('support-nowrap-in-infobox', t => {
  var str = `
  {{Infobox scientist
  | name        = Albert Einstein
  | image       = Einstein 1921 by F Schmutzer - restoration.jpg
  | spouse      = {{nowrap| {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} }}
  | residence   = Germany, Italy, Switzerland, Austria (present-day Czech Republic), Belgium, United States
  | signature = Albert Einstein signature 1934.svg
  }}
  `;
  var infobox = wtf(str).infoboxes(0);
  var data = infobox.json();
  t.equal(data.name.text, 'Albert Einstein', 'got infobox datad');
  t.equal(data.spouse.text, 'Elsa Löwenthal (m. 1919-1936)', 'got tricky marriage value');
  t.end();
});

test('inline-templates', t => {
  var str = `he married {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} in Peterburough`;
  var doc = wtf(str);
  t.equal(doc.text(), 'he married Elsa Löwenthal (m. 1919-1936) in Peterburough', 'inline marriage text');

  str = `he married {{marriage|Johnny-boy}} in Peterburough`;
  doc = wtf(str);
  t.equal(doc.text(), 'he married Johnny-boy in Peterburough', 'marriage-text simple');
  t.end();
});

test('three-layer-templates', t => {
  var str = `she married {{nowrap| {{nowrap| {{marriage|Johnny-boy}} }}}}`;
  var doc = wtf(str);
  t.equal(doc.text(), 'she married Johnny-boy', '3-template inline');
  t.equal(doc.templates(0).template, 'marriage', '3-template result');
  t.end();
});
