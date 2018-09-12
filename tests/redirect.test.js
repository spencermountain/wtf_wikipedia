'use strict';
var test = require('tape');
var readFile = require('./lib/_cachedPage');
var wtf = require('./lib');

test('redirect json', t => {
  let str = `#REDIRECT [[Toronto Blue Jays#Stadium|Tranno]]`;
  let doc = wtf(str);
  t.equal(doc.isRedirect(), true, 'is-redirect');
  var obj = doc.json();
  t.equal(obj.isRedirect, true, 'json-has-redirect');
  t.equal(obj.redirectTo.page, 'Toronto Blue Jays', 'redirect page');
  t.equal(obj.redirectTo.anchor, 'Stadium', 'redirect anchor');
  t.equal(obj.redirectTo.text, 'Tranno', 'redirect text');

  t.end();
});

test('is-redirect', t => {
  var doc = readFile('redirect');
  t.equal(doc.isRedirect(), true, 'is-redirect');
  // t.equal(doc.links(0).page, 'Toronto', 'redirect-place');
  t.equal(doc.infoboxes(0), undefined, t);
  t.end();
});

// test('redirect-output', t => {
//   var doc = readFile('redirect');
// t.equal(doc.text(), '', 'has no text');
// t.equal(doc.sections.length, 0, 'has no sections');
//   t.equal(doc.html(), '', 'html output');
//   t.end();
// });
