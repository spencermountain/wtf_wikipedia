import test from 'tape'
import wtf from './_lib.js'

const opts = {
  'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
}

test('smoketests', function (t) {
  t.equal(typeof wtf.getRandomCategory, 'function', 'has randomCategory method')
  t.equal(typeof wtf.getCategoryPages, 'function', 'has getCategory method')
  t.equal(typeof wtf.getTemplatePages, 'function', 'has getTemplate method')
  t.end()
})

test('randomCategory', (t) => {
  t.plan(1)
  wtf.getRandomCategory(opts).then(function (cat) {
    t.ok(cat, "got randomCategory: '" + cat + "'")
  })
})

test('getCategory', (t) => {
  t.plan(1)
  wtf.getCategoryPages('Swiss female skeleton racers', opts).then(function (docs) {
    t.ok(docs.length > 0, `got ${docs.length} pages for category`)
  })
})

test('getTemplate', (t) => {
  t.plan(1)
  wtf.getTemplatePages('Template:Switzerland-badminton-bio-stub', opts).then(function (list) {
    t.ok(list.length > 0, `got ${list.length} pages for template`)
  })
})

test('wtf.fetchList', (t) => {
  t.plan(3)
  let arr = ['Marina Gilardoni', 'Jessica Kilian', 'Tanja Morel']
  wtf.fetchList(arr, opts).then(function (docs) {
    docs.forEach((doc) => {
      t.ok(doc.sentence().text(), `got ${doc.title()}`)
    })
  })
})
