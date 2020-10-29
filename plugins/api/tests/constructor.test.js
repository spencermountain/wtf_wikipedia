const test = require('tape')
const wtf = require('./_lib')

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

test('smoketests', function (t) {
  t.equal(typeof wtf.randomCategory, 'function', 'has randomCategory method')
  t.equal(typeof wtf.getCategory, 'function', 'has getCategory method')
  t.equal(typeof wtf.getTemplate, 'function', 'has getTemplate method')
  t.end()
})

test('randomCategory', (t) => {
  t.plan(1)
  wtf.randomCategory('en', opts).then(function (cat) {
    t.ok(cat, "got randomCategory: '" + cat + "'")
  })
})

test('getCategory', (t) => {
  t.plan(1)
  wtf.getCategory('Category:Swiss chess players', opts).then(function (res) {
    t.ok(res.docs.length > 0, `got ${res.docs.length} pages for category`)
  })
})

test('getTemplate', (t) => {
  t.plan(1)
  wtf.getTemplate('Template:Switzerland-badminton-bio-stub', opts).then(function (pages) {
    t.ok(pages.length > 0, `got ${pages.length} pages for template`)
  })
})
