var test = require('tape')
var wtf = require('./lib')

test('support bold and italics', (t) => {
  let doc = wtf(`hi <b>world</b> there`)
  t.equal(doc.text(), 'hi world there')
  let obj = doc.sentence(0).json().formatting || {}
  t.equal((obj.bold || [])[0], 'world', 'got bold')

  doc = wtf(`hi <i>world</i> there`)
  t.equal(doc.text(), 'hi world there')
  obj = doc.sentence(0).json().formatting || {}
  t.equal((obj.italic || [])[0], 'world', 'got italic')

  // both
  doc = wtf(`hi <i><b>world</b></i> there`)
  t.equal(doc.text(), 'hi world there')
  obj = doc.sentence(0).json().formatting || {}
  t.equal((obj.bold || [])[0], 'world', 'got bold')
  t.equal((obj.italic || [])[0], 'world', 'got italic')
  t.end()
})
