const test = require('tape')
const wtf = require('../lib')

test('random', t => {
  t.plan(1)
  var p = wtf.random('simple', 'simple', {
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  p.then(function(doc) {
    t.ok(doc.title(), 'got redirect')
  })
  p.catch(function(e) {
    t.throw(e)
  })
})
