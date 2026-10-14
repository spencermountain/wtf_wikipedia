import test from 'tape'
import wtf from '../../../plugins/api/tests/_lib.js'

test('random', async (t) => {
  t.plan(2)
  const page = await wtf.getRandomPage({
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  })
  t.equal(typeof page.title(), 'string', 'title is a string')
  t.ok(page.title().trim(), 'random page has a nonempty title')
})
