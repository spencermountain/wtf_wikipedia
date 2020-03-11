var test = require('tape')
var wtf = require('./_lib')

test('basic-wikitext', t => {
  let arr = ['that cat is [[a]] cool dude', `one [[two|2]] three`, 'cool [[stuff]] **bold** too']
  arr.forEach(str => {
    let doc = wtf(str)
    t.equal(doc.wikitext(), str, str)
  })
  t.end()
})
