'use strict';
var test = require('tape');
var wtf = require('./lib');

test('basic-citation', t => {
  var str = `Emery is a vegetarian,<ref>{{cite web|title=The princess of pot|url=http://thewalrus.ca/the-princess-of-pot/}}</ref>`;
  var arr = wtf(str).citations();
  t.equal(arr.length, 1, 'found-one-citation');
  t.equal('web', arr[0].type, 'cite web');
  t.equal('The princess of pot', arr[0].title, 'title');
  t.equal('http://thewalrus.ca/the-princess-of-pot/', arr[0].url, 'url');
  t.end();
});

test('complex-citation', t => {
  var str = `Emery is a vegetarian,<ref name="fun">{{ cite web|foo =    bar
| url=http://cool.com/?fun=cool/}}</ref>`;
  var arr = wtf(str).citations();
  t.equal(arr.length, 1, 'found-one-citation');
  t.equal(arr[0].type, 'web', 'cite web');
  t.equal(arr[0].foo, 'bar', 'foo');
  t.equal('http://cool.com/?fun=cool/', arr[0].url, 'url');
  t.end();
});

test('multiple-citations', t => {
  var str = `hello {{citation |url=cool.com/?fun=yes/   }}{{CITE book |title=the killer and the cartoons }}`;
  var arr = wtf(str).citations();
  t.equal(arr.length, 2, 'found-two-citations');
  t.equal(arr[0].url.text(), 'cool.com/?fun=yes/', 'url1');
  t.equal('the killer and the cartoons', arr[1].title.text(), 'title2');
  t.end();
});

test('inline-test', t => {
  var str = `"Through Magic Doorways".<ref name="quote">[http://www.imdb.com/name/nm3225194/ Allen Morris IMDb profile]</ref> `;
  var arr = wtf(str).citations();
  t.equal(arr.length, 1, 'found-inline-citations');
  t.equal(arr[0].url, 'http://www.imdb.com/name/nm3225194/', 'inline-url');
  t.equal('Allen Morris IMDb profile', arr[0].text, 'inline-text');
  t.end();
});

test('inline-test2', t => {
  var str = `in 1826.<ref name="brake">Brake (2009)</ref>  `;
  var arr = wtf(str).citations();
  t.equal(arr.length, 1, 'found-inline-citations');
  t.equal('Brake (2009)', arr[0].text, 'inline-text');
  t.end();
});

test('inline harder-citation', t => {
  var str = `<ref name="ChapmanRoutledge">Siobhan Chapman, {{ISBN|0-19-518767-9}}, [https://books.google.com/books?id=Vfr Google Print, p. 166]</ref> She continued her education after.`;
  var arr = wtf(str).citations();
  t.equal(arr.length, 1, 'found-one-citation');
  t.equal('https://books.google.com/books?id=Vfr', arr[0].url, 'fould late link');
  t.end();
});
