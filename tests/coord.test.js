var test = require('tape')
var wtf = require('./lib')

test('coord formats', t => {
  var str = `{{Coord|44.112|-87.913|display=title}}`
  var obj = wtf(str).coordinates()[0]
  t.equal(obj.lat, 44.112, 'fmt-1-lat')
  t.equal(obj.lon, -87.913, 'fmt-1-lon')

  str = `hello {{Coord|44.112|N|87.913|W|display=title}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, 44.112, 'fmt-2-lat')
  t.equal(obj.lon, -87.913, 'fmt-2-lon')

  str = `hello {{Coord|51|30|N|0|7|W|type:city}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, 51.5, 'fmt-2-with-zero-lat')
  t.equal(obj.lon, -0.11667, 'fmt-2-with-zero-lon')

  str = `hello {{coord|9|26|44|S|160|01|13|E |display=title}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, -9.44556, 'fmt-2-with-space-lat')
  t.equal(obj.lon, 160.02028, 'fmt-2-with-space-lon')

  //minutes/seconds
  str = `hello {{Coord|57|18|22|N|4|27|32|W|display=title}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, 57.30611, 'fmt-3-lat')
  t.equal(obj.lon, -4.45889, 'fmt-3-lon')

  // from the dutch wiki
  str = `hello {{Coor title dms|51|26|30|N|4|55|0|E|type:landmark}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, 51.44167, 'fmt-4-lat')
  t.equal(obj.lon, 4.91667, 'fmt-4-lon')
  t.equal(obj.props.type, 'landmark', 'fmt-4-type')

  str = `hello {{Coor title dec|52.652222|5.066388|type:city_region:NL}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, 52.65222, 'fmt-5-lat')
  t.equal(obj.lon, 5.06639, 'fmt-5-lon')
  t.equal(obj.props.type, 'city_region:NL', 'fmt-5-type')

  str = `hello {{Coor dms|29|58|41|N|31|07|53|E|type:landmark_region:EG_scale:5000}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, 29.97806, 'fmt-6-lat')
  t.equal(obj.lon, 31.13139, 'fmt-6-lon')
  t.equal(obj.props.type, 'landmark_region:EG_scale:5000', 'fmt-6-type')

  str = `hello {{Coor dm|64|33|N|40|32|E|type:landmark}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, 64.55, 'fmt-7-lat')
  t.equal(obj.lon, 40.53333, 'fmt-7-lon')
  t.equal(obj.props.type, 'landmark', 'fmt-7-type')

  str = `hello {{Coor dec|-10.341666666667|-179.9997222|scale:25000}} world`
  obj = wtf(str).coordinates(0)
  t.equal(obj.lat, -10.34167, 'fmt-8-lat')
  t.equal(obj.lon, -179.99972, 'fmt-8-lon')
  t.equal(obj.props.scale, '25000', 'fmt-8-type')
  t.end()
})

//thank you to https://github.com/gmaclennan/parse-dms/blob/master/test/index.js
test('Parse DMS', function(t) {
  var str = `hi {{coord|59|12|7.7|N|02|15|39.6|W}} there`
  var obj = wtf(str).coordinates(0)
  var want = {
    lat: 59.20214,
    lon: -2.261
  }
  t.equal(obj.lat, want.lat, 'DMS-1-lat')
  t.equal(obj.lon, want.lon, 'DMS-1-lon')
  t.end()
})
test('Parse DMS-missing', function(t) {
  var str = `hi {{coord|59|N|02|W}} there`
  var obj = wtf(str).coordinates(0)
  var want = {
    lat: 59,
    lon: -2
  }
  t.equal(obj.lat, want.lat, 'DMS-2-lat')
  t.equal(obj.lon, want.lon, 'DMS-2-lon')
  t.end()
})
