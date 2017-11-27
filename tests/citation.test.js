'use strict';
var test = require('tape');
const wtf = require('./lib');

test('basic-citation', t => {
  var str = `Emery is a vegetarian,<ref>{{cite web|title=The princess of pot|url=http://thewalrus.ca/the-princess-of-pot/}}</ref>`;
  let arr = wtf.parse(str).citations;
  t.equal(1, arr.length, 'found-one-citation');
  t.equal('web', arr[0].cite, 'cite web');
  t.equal('The princess of pot', arr[0].title, 'title');
  t.equal('http://thewalrus.ca/the-princess-of-pot/', arr[0].url, 'url');
  t.end();
});
test('complex-citation', t => {
  var str = `Emery is a vegetarian,<ref name="fun">{{cite web|foo =    bar\n| url=http://cool.com/?fun=cool/}}</ref>`;
  let arr = wtf.parse(str).citations;
  t.equal(1, arr.length, 'found-one-citation');
  t.equal('web', arr[0].cite, 'cite web');
  t.equal('bar', arr[0].foo, 'foo');
  t.equal('http://cool.com/?fun=cool/', arr[0].url, 'url');
  t.end();
});
