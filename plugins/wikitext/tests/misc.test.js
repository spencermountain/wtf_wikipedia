var test = require('tape')
var wtf = require('./_lib')

var tidy = str => {
  str = str.replace(/\s[\s]+/g, ' ')
  str = str.replace(/\n/g, '')
  str = str.trim()
  return str
}

test('basic-wikitext', t => {
  let arr = ['that cat is [[a]] cool dude', `one [[two|2]] three`, 'cool [[stuff]] **bold** too']
  arr.forEach(str => {
    let doc = wtf(str)
    t.equal(tidy(doc.wikitext()), tidy(str), str)
  })
  t.end()
})
