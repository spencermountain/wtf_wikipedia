import test from 'tape'
import wtf from '../../../plugins/api/tests/_lib.js'

const defaultOptions = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

async function fetchCategories(t, cat, options) {
  const results = await wtf.getCategoryPages(cat, {
    ...defaultOptions,
    ...options
  })
  const pages = results.filter(({ type }) => type == 'page')
  const subcats = results.filter(({ type }) => type == 'subcat')
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

test('category - single level', async (t) => {
  t.plan(3)
  const results = await fetchCategories(t, 'Category:Politicians_from_Paris', {})
  const { pages, subcats } = results
  t.ok(pages.length > 2, 'got some actual real pages')
  t.ok(subcats.length > 2, 'got some sub-categories')
})
