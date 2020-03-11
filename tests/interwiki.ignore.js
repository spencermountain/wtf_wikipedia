var test = require('tape')
var wtf = require('./lib')

test('interwiki links', t => {
  var doc = wtf('hi [[as:Plancton]] there')
  t.equal(doc.text(), 'hi there', 'strip full interwiki')
  // t.equal(doc.interwiki().length, 0, 'no interwiki');
  //
  // doc = wtf(`hi [[wiktionary:as:Plancton]] there [[zh:天問|天問]]`);
  // t.equal(doc.text(), 'hi wiktionary:as:Plancton there', 'strip full interwiki');
  // t.equal(doc.interwiki().length, 1, 'has interwiki');

  t.end()
})
