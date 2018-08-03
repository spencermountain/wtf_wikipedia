'use strict';
var wtf = require('./lib');
var test = require('tape');

test('remove wikitext from caption titles', function(t) {
  var str = `
hello
== {{anchor|Foo}} Foo [[Bar]] ==
this is working
i believe that 5===true and y===false
  `;
  var sections = wtf(str).sections().map(s => s.json());
  t.equal(sections.length, 2, 'two-sections');
  t.equal(sections[0].title, '', 'implicit-section');
  t.equal(sections[1].title, 'Foo Bar', 'clean-section');
  t.end();
});
