import test from 'tape'
import wtf from '../../../plugins/api/tests/_lib.js'

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

test('getPageViews', async (t) => {
  t.plan(1)
  const doc = wtf('', opts)
  doc.title('Toronto Raptors')
  doc.lang('en')
  const byDate = await doc.getPageViews()
  const dates = Object.keys(byDate)
  t.ok(dates.length > 5, `got pageViews for ${dates.length} days`)
})

test('getRedirects', async (t) => {
  t.plan(1)
  const doc = wtf('', opts)
  doc.title('Toronto Raptors')
  doc.lang('en')
  const links = await doc.getRedirects()
  t.ok(links.length > 3, `got ${links.length} redirects for Toronto Raptors`)
})

test('incomingLinks', async (t) => {
  t.plan(1)
  const doc = wtf('', opts)
  doc.title('Marty Embry')
  doc.lang('en')
  const links = await doc.getIncoming()
  t.ok(links.length > 3, `got ${links.length} links for Marty Embry`)
})
