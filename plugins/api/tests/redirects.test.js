const test = require('tape')
const wtf = require('./_lib')

test('redirects method', function (t) {
  let doc = wtf('')
  t.equal(typeof doc.redirects, 'function', 'has redirect method')
  t.end()
})
