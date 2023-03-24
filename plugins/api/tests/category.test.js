import test from 'tape'
import wtf from './_lib.js'

const defaultOptions = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

async function fetchCategories(t, cat, options) {
  let results = await wtf.getCategoryPages(cat, {
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
  const p = fetchCategories(t, 'Category:Politicians_from_Paris', {})
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
  t.plan(9)
  let cat = 'Category:Genocide_education'
  const pNonRecursive = fetchCategories(t, cat, {})
  const pRecursive = fetchCategories(t, cat, { recursive: true })
  const pRecursiveLimited = fetchCategories(t, cat, { recursive: true, maxDepth: 2 })
  const p = Promise.all([pNonRecursive, pRecursive, pRecursiveLimited])
  p.then(function ([nonRecursive, recursive, recursiveLimited]) {
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
    //now check that recursive with depth-limiting brought back fewer results than unlimited recursive mode but still more than non-recursive
    t.ok(
      recursiveLimited.pages.length > nonRecursive.pages.length &&
        recursiveLimited.pages.length < recursive.pages.length,
      'using limited recursive brought in more pages than non-recursive, but less than fully recursive'
    )
    t.ok(
      recursiveLimited.subcats.length > nonRecursive.subcats.length &&
        recursiveLimited.subcats.length < recursive.subcats.length,
      'using limited recursive brought in more subcategories than non-recursive, but less than fully recursive'
    )
  })
  p.catch(function (e) {
    t.throw(e)
  })
})
