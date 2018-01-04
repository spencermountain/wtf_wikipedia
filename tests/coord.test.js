'use strict';
var test = require('tape');
var wtf = require('./lib');

test('coord formats', t => {
  var str = `{{Coord|44.112|-87.913|display=title}}`;
  var obj = wtf.parse(str).coordinates[0];
  t.equal(obj.lat, 44.112, 'fmt-1-lat');
  t.equal(obj.lon, -87.913, 'fmt-1-lon');

  str = `hello {{Coord|44.112|N|87.913|S|display=title}} world`;
  obj = wtf.parse(str).coordinates[0];
  t.equal(obj.lat, 44.112, 'fmt-2-lat');
  t.equal(obj.lon, -87.913, 'fmt-2-lon');

  str = `hello {{Coord|51|30|N|0|7|W|type:city}} world`;
  obj = wtf.parse(str).coordinates[0];
  t.equal(obj.lat, 51.5, 'fmt-2-with-zero-lat');
  t.equal(obj.lon, -0.11667, 'fmt-2-with-zero-lon');

  //minutes/seconds
  str = `hello {{Coord|57|18|22|N|4|27|32|W|display=title}} world`;
  obj = wtf.parse(str).coordinates[0];
  t.equal(obj.lat, 57.30611, 'fmt-3-lat');
  t.equal(obj.lon, -4.45889, 'fmt-3-lon');
  t.end();
});

//thank you to https://github.com/gmaclennan/parse-dms/blob/master/test/index.js
test('Parse DMS', function(t) {
  var str = `hi {{coord|59|12|7.7|N|02|15|39.6|W}} there`;
  var obj = wtf.parse(str).coordinates[0];
  var want = {
    lat: 59.20214,
    lon: -2.261
  };
  t.equal(obj.lat, want.lat, 'DMS-1-lat');
  t.equal(obj.lon, want.lon, 'DMS-1-lon');
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
  t.equal(obj.lon, want.lon, 'DMS-2-lon');
  t.end();
});
