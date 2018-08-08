'use strict';
var test = require('tape');
var wtf = require('./lib');

test('document-links', t => {
  var str = `before [[the shining|movie]]
{|
! h1 !! h2 || h3
|-
| one
| two
| three
|-
|  [[Minnesota Twins|Twins]]
| five
| six
|}

after now
* one
* two
* [[three]]
* four
`;
  var links = wtf(str).links();
  t.equal(links.length, 3, 'found-all-links');
  t.ok(links.find(l => l.text), 'movie', 'link-text');
  t.ok(links.find(l => l.page), 'Minnesota Twins', 'link-table');
  t.ok(links.find(l => l.page), 'three', 'link-list');
  t.end();
});
