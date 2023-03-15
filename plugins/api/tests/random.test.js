import test from 'tape'
import wtf from './_lib.js'

test('random', (t) => {
  t.plan(1)
  let p = wtf.getRandomPage({
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
