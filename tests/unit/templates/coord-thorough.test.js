import test from 'tape'
import wtf from '../../lib/index.js'

test('coord - lat/lon from every input format', (t) => {
  const arr = [
    // decimal
    ['{{coord|43.651|-79.383}}', 43.651, -79.383],
    ['{{coord|-33.86|151.21}}', -33.86, 151.21],
    ['{{coord|0|0}}', 0, 0],
    ['{{coord|90|0}}', 90, 0],
    // decimal + hemisphere
    ['{{coord|43|N|79|W}}', 43, -79],
    ['{{coord|12.5|N|45.25|E}}', 12.5, 45.25],
    // degrees + minutes
    ['{{coord|43|39|N|79|23|W}}', 43.65, -79.38333],
    ['{{coord|33|52|S|151|12|E}}', -33.86667, 151.2],
    // degrees + minutes + seconds
    ['{{coord|43|39|4|N|79|23|0|W}}', 43.65111, -79.38333],
    ['{{coord|33|52|10|S|151|12|30|E|type:city}}', -33.86944, 151.20833],
    ['{{Coord|40|26|46|N|79|58|56|W|display=title}}', 40.44611, -79.98222],
    // aliases
    ['{{coor dms|40|26|46|N|79|58|56|W}}', 40.44611, -79.98222],
    ['{{coor dec|40.4|-79.9}}', 40.4, -79.9],
    ['{{coor dm|43|39|N|79|23|W}}', 43.65, -79.38333],
  ]
  arr.forEach(([str, lat, lon]) => {
    const obj = wtf(str).coordinates()[0] || {}
    t.equal(obj.lat, lat, `${str} lat`)
    t.equal(obj.lon, lon, `${str} lon`)
  })
  t.end()
})

test('coord - parameters', (t) => {
  let obj = wtf('{{coord|33|52|10|S|151|12|30|E|type:city}}').coordinates()[0]
  t.equal(obj.props.type, 'city', 'colon parameter goes to props')

  obj = wtf('{{coord|43.651|-79.383|display=title}}').coordinates()[0]
  t.equal(obj.display, 'title', 'display parameter kept')

  obj = wtf('{{coord|35.6895|139.6917|name=Tokyo}}').coordinates()[0]
  t.equal(obj.name, 'Tokyo', 'name parameter kept')

  obj = wtf('{{coord|foo|bar}}').coordinates()[0] || {}
  t.equal(obj.lat, undefined, 'non-numeric input has no lat')
  t.equal(obj.lon, undefined, 'non-numeric input has no lon')
  t.end()
})

test('coord - display', (t) => {
  t.equal(wtf('{{coord|43.651|-79.383|display=title}}').text(), '', 'display=title is not inline')
  t.equal(wtf('{{Coord|40|26|46|N|79|58|56|W|display=title}}').text(), '', 'dms display=title is not inline')
  t.ok(wtf('{{coord|43.651|-79.383|display=inline,title}}').text().includes('43.651'), 'inline,title renders inline')
  t.ok(wtf('{{coord|43.651|-79.383}}').text().includes('43.651°N'), 'inline by default')
  t.end()
})

test('coord - document and section coordinates', (t) => {
  const doc = wtf('Hello {{coord|1|2}} there. Then {{coord|3|4}}.\n== A ==\nX {{coord|5|6}}.')
  t.equal(doc.coordinates().length, 3, 'all coords on the page')
  t.deepEqual(
    doc.coordinates().map((c) => [c.lat, c.lon]),
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    'in page order'
  )
  t.equal(doc.section(0).coordinates().length, 2, 'intro has two')
  t.equal(doc.section('A').coordinates()[0].lat, 5, 'section A coord')
  t.match(doc.sentences()[0].text(), /^Hello 1°N.* there\.$/, 'inline coord stays inside its sentence')
  t.end()
})

// wikipedia shows the hemisphere letter instead of a sign, eg '33.86°S 151.21°E'
test('coord - hemisphere letters', (t) => {
  const arr = [
    ['{{coord|43.651|-79.383}}', /43\.651°N,? 79\.383°W/],
    ['{{coord|-33.86|151.21}}', /33\.86°S,? 151\.21°E/],
    ['{{coord|33|52|S|151|12|E}}', /^33°52′S 151°12′E$/],
    ['{{coord|12.5|N|45.25|E}}', /12\.5°N,? 45\.25°E/],
    ['{{coord|0|0}}', /^0°N,? 0°E$/],
    ['{{coord|90|0}}', /^90°N,? 0°E$/],
  ]
  arr.forEach(([str, re]) => {
    t.match(wtf(str).text(), re, str)
  })
  t.equal(wtf('{{coord|foo|bar}}').text(), '', 'invalid coord renders nothing')
  // the German {{Coordinate}} template uses named NS/EW params
  const obj = wtf('{{Coordinate|NS=52/31/7/N|EW=13/24/30/E}}').coordinates()[0] || {}
  t.equal(obj.lat, 52.51861, '{{Coordinate}} NS lat')
  t.equal(obj.lon, 13.40833, '{{Coordinate}} EW lon')
  t.end()
})
