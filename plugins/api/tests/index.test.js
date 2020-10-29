const test = require('tape')
const wtf = require('./_lib')

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

test('smoketests', function (t) {
  let doc = wtf('')
  t.equal(typeof doc.redirects, 'function', 'has redirect method')
  t.equal(typeof doc.incomingLinks, 'function', 'has incomingLinks method')
  t.equal(typeof doc.pageViews, 'function', 'has pageViews method')
  t.equal(typeof wtf.randomCategory, 'function', 'has randomCategory method')
  t.end()
})

test('randomCategory', (t) => {
  t.plan(1)
  const p = wtf.randomCategory('en', opts)
  p.then(function (cat) {
    t.ok(cat, "got randomCategory: '" + cat + "'")
  })
})

test('pageViews', (t) => {
  t.plan(1)
  let doc = wtf('')
  doc.title('Toronto Raptors')
  doc.lang('en')
  doc.pageViews(opts).then(function (byDate) {
    let dates = Object.keys(byDate)
    t.ok(dates.length > 5, `got pageViews for ${dates.length} days`)
  })
})

test('redirects', (t) => {
  t.plan(1)
  let doc = wtf('')
  doc.title('Toronto Raptors')
  doc.lang('en')
  doc.redirects(opts).then(function (links) {
    t.ok(links.length > 3, `got ${links.length} redirects for Toronto Raptors`)
  })
})

test('incomingLinks', (t) => {
  t.plan(1)
  let doc = wtf('')
  doc.title('Marty Embry')
  doc.lang('en')
  doc.incomingLinks(opts).then(function (links) {
    t.ok(links.length > 3, `got ${links.length} links for Marty Embry`)
  })
})
