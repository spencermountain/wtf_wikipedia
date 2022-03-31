import test from 'tape'
import wtf from './_lib.js'

// this seems too much network traffic to run each test
test('ensure functions are there', function (t) {
  t.ok(typeof wtf.parseCategory === 'function', 'wtf.parseCategory exists')
  t.ok(typeof wtf.randomCategory === 'function', 'wtf.randomCategory exists')
  t.ok(typeof wtf.parseCategory() === 'object', 'return promise #1')
  t.ok(typeof wtf.randomCategory() === 'object', 'return promise #2')
  t.end()
})
