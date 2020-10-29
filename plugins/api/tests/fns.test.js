const test = require('tape')
const wtf = require('./_lib')

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

test('smoketests', function (t) {
  let doc = wtf('')
  t.equal(typeof doc.getRedirects, 'function', 'has getRedirects method')
  t.equal(typeof doc.getIncoming, 'function', 'has getIncoming method')
  t.equal(typeof doc.getPageViews, 'function', 'has getPageViews method')
  t.end()
})

test('getPageViews', (t) => {
  t.plan(1)
  let doc = wtf('')
  doc.title('Toronto Raptors')
  doc.lang('en')
  doc.getPageViews(opts).then(function (byDate) {
    let dates = Object.keys(byDate)
    t.ok(dates.length > 5, `got pageViews for ${dates.length} days`)
  })
})

test('getRedirects', (t) => {
  t.plan(1)
  let doc = wtf('')
  doc.title('Toronto Raptors')
  doc.lang('en')
  doc.getRedirects(opts).then(function (links) {
    t.ok(links.length > 3, `got ${links.length} redirects for Toronto Raptors`)
  })
})

test('incomingLinks', (t) => {
  t.plan(1)
  let doc = wtf('')
  doc.title('Marty Embry')
  doc.lang('en')
  doc.getIncoming(opts).then(function (links) {
    t.ok(links.length > 3, `got ${links.length} links for Marty Embry`)
  })
})
