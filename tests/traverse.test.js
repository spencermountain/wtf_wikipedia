'use strict';
var test = require('tape');
var readFile = require('./lib/_cachedPage');

test('traverse sections', t => {
  var doc = readFile('toronto');
  t.equal(doc.sections().length, 35, 'init section count');

  var sec = doc.section('History');
  t.equal(sec.title, 'History', 'init history');

  sec = sec.nextSibling();
  t.equal(sec.title, 'Geography', 'skip-over children');

  let children = sec.children().map(s => s.title);
  t.deepEqual(['Topography', 'Climate'], children, 'got two children');

  sec = sec.children(0);
  t.equal(sec.title, 'Topography', 'first child');
  sec = sec.nextSibling();
  t.equal(sec.title, 'Climate', 'first child');

  sec = sec.parent();
  t.equal(sec.title, 'Geography', 'skip-over children');

  t.equal(sec.children('Climate').title, 'Climate', 'second child');

  sec.remove();
  t.equal(doc.sections().length, 32, 'removed self and children');

  doc.sections('See also').remove();
  t.equal(doc.sections().length, 31, 'removed one');

  t.end();
});
