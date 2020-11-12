const test = require('tape')
const wtf = require('./_lib')

test('random', (t) => {
  t.plan(1)
  let p = wtf.getRandomPage('simple', 'simple', {
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  p.then(function (page) {
    t.ok(page.title, 'got random page ' + page.title)
  })
  p.catch(function (e) {
    t.throw(e)
  })
})
