'use strict';
var test = require('tape');
var wtf = require('./lib');

test('inline-templates', t => {
  var arr = [
    [`{{nobold| [[#Structure and name|↓]] }}`, `↓`],
    [`[[Salt]]{{•}} [[Pepper]]`, `Salt • Pepper`],
    [`[[Salt]]{{ndash}}[[Pepper]]`, `Salt–Pepper`],
    ['[[Salt]]{{\\}}[[Black pepper|Pepper]]', `Salt / Pepper`],
    ['[[Salt]]{{snds}}[[Black pepper|Pepper]]{{snds}}[[Curry]]{{snds}}[[Saffron]]', `Salt – Pepper – Curry – Saffron`],
    [`{{braces|Templatename|item1|item2}}`, `{{Templatename|item1|item2}}`],
  ];
  arr.forEach((a) => {
    t.equal(wtf(a[0]).text(), a[1], a[0]);
  });
  t.end();
});
