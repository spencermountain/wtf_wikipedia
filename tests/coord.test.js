'use strict';
var test = require('tape');
var wtf = require('../src/index');

test('coord formats', t => {
  var str = `{{Coord|44.112|-87.913|display=title}}`;
  var obj = wtf.parse(str).coordinates[0];
  t.equal(obj.lat, 44.112, 'fmt-1-north');
  t.equal(obj.lng, 87.913, 'fmt-1-west');

  // str = `hello {{Coord|44.112|N|87.913|W|display=title}} world`;
  // obj = wtf.parse(str).coordinates[0];
  // t.equal(obj.north, 44.112, 'fmt-2-north');
  // t.equal(obj.west, 87.913, 'fmt-2-west');

  //minutes/seconds
  // str = `hello {{Coord|57|18|22|N|4|27|32|W|display=title}} world`;
  // obj = wtf.parse(str).coordinates[0];
  // t.equal(obj.north, 44.112, 'fmt-1-north');
  // t.equal(obj.west, 87.913, 'fmt-1-west');
  t.end();
});

//thank you to https://github.com/gmaclennan/parse-dms/blob/master/test/index.js
test('Parse DMS', function(t) {
  var str = `hi {{coord|59|12|7.7|N|02|15|39.6|W}} there`;
  var obj = wtf.parse(str).coordinates[0];
  var want = {
    lat: 59 + 12 / 60 + 7.7 / 3600,
    lon: -1 * (2 + 15 / 60 + 39.6 / 3600)
  };
  t.equal(obj.lat, want.lat, 'DMS-1-lat');
  t.equal(obj.lng, want.long, 'DMS-1-lon');
  t.end();
});
test('Parse DMS-missing', function(t) {
  var str = `hi {{coord|59|N|02|W}} there`;
  var obj = wtf.parse(str).coordinates[0];
  var want = {
    lat: 59,
    lon: -2
  };
  t.equal(obj.lat, want.lat, 'DMS-2-lat');
  t.equal(obj.lng, want.long, 'DMS-2-lon');
  t.end();
});
