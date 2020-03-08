const test = require('tape')
const wtf = require('../lib')

test('category', t => {
  t.plan(2)
  var p = wtf.category('Category:Basketball teams in Toronto', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  p.then(function(res) {
    t.ok(res.pages.length > 2, 'got some pages')
    t.ok(res.categories.length > 1, 'got a subcategory')
  })
  p.catch(function(e) {
    t.throw(e)
  })
})
