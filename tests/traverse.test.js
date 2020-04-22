var test = require('tape')
var readFile = require('./lib/_cachedPage')

test('traverse sections', (t) => {
  var doc = readFile('toronto')
  t.equal(doc.sections().length, 35, 'init section count')

  //start with history
  var sec = doc.section('History')
  t.equal(sec.title(), 'History', 'init history')

  //skip-over to 0-Geography
  sec = sec.nextSibling()
  t.equal(sec.title(), 'Geography', 'skip-over children')

  var children = sec.children().map((s) => s.title())
  t.deepEqual(['Topography', 'Climate'], children, 'got two children')

  //go into both children, Topography+Climate
  sec = sec.children(0)
  t.equal(sec.title(), 'Topography', 'first child')
  sec = sec.nextSibling()
  t.equal(sec.title(), 'Climate', 'first child')

  //still at Geography..
  sec = sec.parent()
  t.equal(sec.title(), 'Geography', 'skip-over children')
  //access child by title
  t.equal(sec.children(1).title(), 'Climate', 'second child')

  sec.remove()
  t.equal(doc.sections().length, 32, 'removed self and children')
  doc.sections('See also').remove()
  t.equal(doc.sections().length, 31, 'removed one')

  t.end()
})
