'use strict';
var wtf = require('./lib');
var test = require('tape');

test('tough sentence punctuation', function(t) {
  var arr = [
    `he is credited as '''Mr. Lawrence''' and sometimes '''Doug Lawrence'''.`,
    `he is credited as '''[[Mr. Lawrence]]''' and sometimes '''[[Doug Lawrence]]'''.`,
    `he is credited as [[Mr. Lawrence]] and sometimes Doug Lawrence.`,
    `he is credited as [http://cool.com Mr. Lawrence] and sometimes Doug Lawrence.`,
    `he is credited as {{asdf}}Mr. Lawrence and sometimes Doug Lawrence.`,
    `he is credited as Mr.{{asdf}} Lawrence and sometimes Doug Lawrence.`,
  // `he is credited as ([[Mr. Lawrence]]) and sometimes Doug Lawrence.`,
  // `he is credited as (''[[Mr. Lawrence]]'') and sometimes Doug Lawrence.`,
  ];
  arr.forEach((str, i) => {
    var doc = wtf(str);
    t.equal(doc.sentences(0).text(), 'he is credited as Mr. Lawrence and sometimes Doug Lawrence.', 'tough-sentence #' + i);
  });
  t.end();
});
