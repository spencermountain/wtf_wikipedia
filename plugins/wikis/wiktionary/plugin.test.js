const wtf = require('../../../src')
wtf.plugin(require('./plugin'))
const test = require('tape')

test('inline-with-data', function (t) {
  const arr = [
    [`acronym`, `{{acronym of|graphical user interface|lang=en}}`],
    [`la-verb-form`, `{{la-verb-form|amāre}}`],
    ['inflection', `{{inflection of|avoir||3|p|pres|ind|lang=fr}}`],
  ]
  arr.forEach((a) => {
    const doc = wtf(a[1])
    const len = doc.templates().length
    t.equal(len, 1, a[0] + ': unexpected templates count')
    t.notEqual(doc.text(), '', a[0] + ': must not be empty')
    t.notEqual(doc.text(), a[1], a[0] + ': must change')
  })
  t.end()
})

// test('inline-output', (t) => {
//   const arr = [
//   ]
//   arr.forEach((a) => {
//     t.equal(wtf(a[0]).text(), a[1], a[0])
//   })
//   t.end()
// })

// test('inline-no-data', function (t) {
//   const arr = [
//   ]
//   arr.forEach((a) => {
//     const doc = wtf(a[1])
//     const len = doc.templates().length
//     t.equal(len, 0, a[0] + ': unexpected templates count')
//     t.notEqual(doc.text(), '', a[0] + ': must not be empty')
//     t.notEqual(doc.text(), a[1], a[0] + ': must change')
//   })
//   t.end()
// })
