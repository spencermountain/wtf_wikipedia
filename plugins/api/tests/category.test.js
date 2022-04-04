import test from 'tape'
import wtf from './_lib.js'

test('category', (t) => {
  t.plan(1)
  const p = wtf.getCategoryPages('Category:Basketball teams in Toronto', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  p.then(function (pages) {
    t.ok(pages.length > 2, 'got some pages')
  })
  p.catch(function (e) {
    t.throw(e)
  })
})
