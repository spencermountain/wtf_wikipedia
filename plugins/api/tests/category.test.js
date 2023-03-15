import test from 'tape'
import wtf from './_lib.js'

test('category', (t) => {
  t.plan(2)
  const p = wtf.getCategoryPages('Category:Politicians_from_Paris', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  p.then(function (pages) {
    let realPages = pages.filter(page => !page.title.startsWith('Category:'))
    let subcategories = pages.filter(page => page.title.startsWith('Category:'))
    t.ok(realPages.length > 2, 'got some actual real pages')
    t.ok(subcategories.length > 2, 'got some sub-categories')
  })
  p.catch(function (e) {
    t.throw(e)
  })
})
