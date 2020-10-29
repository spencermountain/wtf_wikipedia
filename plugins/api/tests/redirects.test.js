const test = require('tape')
const wtf = require('./_lib')

test('smoketests', function (t) {
  let doc = wtf('')
  t.equal(typeof doc.redirects, 'function', 'has redirect method')
  t.equal(typeof doc.incomingLinks, 'function', 'has incomingLinks method')
  t.equal(typeof doc.pageViews, 'function', 'has pageViews method')
  t.end()
})
