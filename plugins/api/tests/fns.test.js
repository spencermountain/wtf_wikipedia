import test from 'tape'
import wtf from './_lib.js'

test('smoketests', function (t) {
  const doc = wtf('')
  t.equal(typeof doc.getRedirects, 'function', 'has getRedirects method')
  t.equal(typeof doc.getIncoming, 'function', 'has getIncoming method')
  t.equal(typeof doc.getPageViews, 'function', 'has getPageViews method')
  t.end()
})
