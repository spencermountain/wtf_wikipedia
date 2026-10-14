import test from 'tape'
import wtf from '../../lib/index.js'

test('support bold and italics', (t) => {
  let doc = wtf(`hi <b>world</b> there`)
  t.equal(doc.text(), 'hi world there', 'bold text')
  let obj = doc.sentence(0).json().formatting || {}
  t.equal((obj.bold || [])[0], 'world', 'got bold')

  doc = wtf(`hi <i>world</i> there`)
  t.equal(doc.text(), 'hi world there', 'italic text')
  obj = doc.sentence(0).json().formatting || {}
  t.equal((obj.italic || [])[0], 'world', 'got italic')

  // both
  doc = wtf(`hi <i><b>world</b></i> there`)
  t.equal(doc.text(), 'hi world there', 'nested bold and italic text')
  obj = doc.sentence(0).json().formatting || {}
  t.equal((obj.bold || [])[0], 'world', 'got bold')
  t.equal((obj.italic || [])[0], 'world', 'got italic')
  t.end()
})

test('support sub and sup', (t) => {
  let doc = wtf(`hi <sub>world</sub> there`)
  t.equal(doc.text(), 'hi world there', 'subscript text')
  let tmpl = doc.template().json() || {}
  t.equal(tmpl.text, 'world', 'got sub template')

  doc = wtf(`hi <sup>world</sup> there`)
  t.equal(doc.text(), 'hi world there', 'superscript text')
  tmpl = doc.template().json() || {}
  t.equal(tmpl.text, 'world', 'got sup template')
  t.end()
})
