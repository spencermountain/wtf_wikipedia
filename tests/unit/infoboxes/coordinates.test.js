import test from 'tape'
import wtf from '../../lib/index.js'

test('infobox degree/minute coordinates accept blank seconds', (t) => {
  const doc = wtf('{{Infobox settlement|latd=43|latm=42|lats=|latNS=N|longd=79|longm=24|longs=|longEW=W}}')
  const expected = { template: 'infobox/lat-long', lat: 43.7, lon: -79.4 }
  t.deepEqual(doc.infobox().coordinates(), expected)
  t.deepEqual(doc.coordinates(), [expected], 'document exposes infobox coordinates')
  t.end()
})

test('infobox underscored coordinates include seconds and hemisphere signs', (t) => {
  const doc = wtf('{{Infobox settlement|lat_d=33|lat_m=30|lat_s=36|lat_ns=s|long_d=151|long_m=15|long_s=36|long_ew=e}}')
  t.ok(Math.abs(doc.coordinate().lat - -33.51) < 1e-9, 'southern latitude')
  t.ok(Math.abs(doc.coordinate().lon - 151.26) < 1e-9, 'eastern longitude')
  t.end()
})

test('infobox coordinates default missing minutes and seconds to zero', (t) => {
  const doc = wtf('{{Infobox settlement|latd=-33|longd=151}}')
  t.equal(doc.coordinate().lat, -33, 'signed degrees work without a hemisphere')
  t.equal(doc.coordinate().lon, 151)
  const zero = wtf('{{Infobox settlement|latd=0|longd=0}}')
  t.equal(zero.coordinate().lat, 0, 'zero is a valid latitude')
  t.equal(zero.coordinate().lon, 0, 'zero is a valid longitude')
  t.end()
})

test('hemisphere signs are not applied twice', (t) => {
  const doc = wtf('{{Infobox settlement|latd=-33|latNS=S|longd=-79|longEW=W}}')
  t.equal(doc.coordinate().lat, -33)
  t.equal(doc.coordinate().lon, -79)
  t.end()
})

test('decimal infobox coordinates take precedence', (t) => {
  const doc = wtf('{{Infobox settlement|latitude=10|longitude=20|latd=43|latm=42|longd=79|longEW=W}}')
  t.deepEqual(doc.coordinate(), { template: 'infobox/lat-long', lat: 10, lon: 20 })
  t.end()
})

test('incomplete or invalid infobox coordinates are ignored', (t) => {
  const cases = [
    'latd=43',
    'latd=|longd=79',
    'latd=unknown|longd=79',
    'latd=43|latm=60|longd=79',
    'latd=43|lats=-1|longd=79',
    'latd=91|longd=79',
    'latd=43|longd=180|longm=1',
    'latd=43|latNS=W|longd=79',
  ]
  cases.forEach((fields) => {
    t.deepEqual(wtf('{{Infobox settlement|' + fields + '}}').coordinates(), [], fields)
  })
  t.end()
})
