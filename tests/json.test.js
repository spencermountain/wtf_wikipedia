'use strict';
var test = require('tape');
var readFile = require('./lib/_cachedPage');

test('json-output-default', t => {

  var data = readFile('royal_cinema').json();
  t.ok(data.title, 'title');
  t.ok(data.categories, 'categories');
  t.end();
});
