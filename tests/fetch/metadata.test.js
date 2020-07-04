var test = require('tape')
var wtf = require('../lib')

test('get metadata', (t) => {
  t.plan(2)
  var p = wtf.fetch('Toronto Raptors', 'en', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
  })
  p.then(function (doc) {
    t.equal(doc.pageID(), 72879, 'got wikipedia id')
    t.equal(doc.wikidata(), 'Q132880', 'got wikidata id')
  })
  p.catch(function (e) {
    t.throw(e)
  })
})
