var test = require('tape')
var wtf = require('./_lib')

test('sentence-isAlive', (t) => {
  // let str = `'''Tom Anselmi''' (born {{circa|1956}}) is a Canadian [[sport]]s [[Senior management|executive]].`
  // let doc = wtf(str)
  // t.equal(doc.isAlive(), true, 'circa-template')

  let str = `'''David Jones''' (8 January 1947 – 10 January 2016), known professionally as David`
  let doc = wtf(str)
  t.equal(doc.isAlive(), false, 'both-dates')
  t.end()
})

test('template-isAlive', (t) => {
  let str = `{{WikiProject Biography|living=yes|activepol=yes}}`
  let doc = wtf(str)
  t.ok(doc.isAlive(), true, 'WikiProject Biography')

  str = `{{Recent death presumed}}`
  doc = wtf(str)
  t.equal(doc.isAlive(), false, 'Recent death presumed')
  t.end()
})

test('category-isAlive', (t) => {
  let doc = wtf(`hello [[Category:1952 births]]    [[Category:Living people]]`)
  t.equal(doc.isAlive(), true, 'Category:Living people')
  t.end()
})
