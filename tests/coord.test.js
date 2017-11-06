'use strict';
var test = require('tape');
const wtf = require('../src/index');

test('coord formats', t => {
  let str = `{{Coord|44.112|-87.913|display=title}}`;
  let obj = wtf.parse(str).coordinates[0];
  t.equal(obj.lat, 44.112, 'fmt-1-north');
  t.equal(obj.lng, 87.913, 'fmt-1-west');

  str = `hello {{Coord|44.112|N|87.913|W|display=title}} world`;
  obj = wtf.parse(str).coordinates[0];
  t.equal(obj.north, 44.112, 'fmt-2-north');
  t.equal(obj.west, 87.913, 'fmt-2-west');

  //minutes/seconds
  // str = `hello {{Coord|57|18|22|N|4|27|32|W|display=title}} world`;
  // obj = wtf.parse(str).coordinates[0];
  // t.equal(obj.north, 44.112, 'fmt-1-north');
  // t.equal(obj.west, 87.913, 'fmt-1-west');
  t.end();
});
