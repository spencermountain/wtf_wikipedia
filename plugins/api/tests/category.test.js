import test from 'tape'
import wtf from './_lib.js'

const defaultOptions = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

async function fetchCategories(t, options) {
  let results = await wtf.getCategoryPages('Category:Politicians_from_Paris', {
    ...defaultOptions,
    ...options
  })
  let pages = results.filter(({ type }) => type == 'page')
  let subcats = results.filter(({ type }) => type == 'subcat')
  t.equal(
    pages.length + subcats.length,
    results.length,
    'all results should be either pages or subcats'
  )
  return {
    pages,
    subcats
  }
}

test('category - single level', (t) => {
  t.plan(3)
  const p = fetchCategories(t, {})
  p.then(function (results) {
    const { pages, subcats } = results
    t.ok(pages.length > 2, 'got some actual real pages')
    t.ok(subcats.length > 2, 'got some sub-categories')
  })
  p.catch(function (e) {
    t.throw(e)
  })
})

test('category - recursive', (t) => {
  t.plan(6)
  const pNonRecursive = fetchCategories(t, {})
  const pRecursive = fetchCategories(t, { recursive: true })
  const p = Promise.all([pNonRecursive, pRecursive])
  p.then(function ([nonRecursive, recursive]) {
    //check that non recursive returned _something_ (i.e. check that our test is still valid)
    t.ok(nonRecursive.pages.length > 2, 'got some actual real pages')
    t.ok(nonRecursive.subcats.length > 2, 'got some sub-categories')
    //now check that the recursive mode brought back more things (which is expected in this case)
    t.ok(
      recursive.pages.length > nonRecursive.pages.length,
      'using recursive brought in more pages'
    )
    t.ok(
      recursive.subcats.length > nonRecursive.subcats.length,
      'using recursive brought in more subcategories'
    )
  })
  p.catch(function (e) {
    t.throw(e)
  })
})
