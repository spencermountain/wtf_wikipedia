'use strict'
var test = require('tape')
var wtf = require('./lib')

wtf.extend((models, templates) => {
  templates.nest = 0
})

test('nesting-test', t => {
  let str = `{{nest|one}}`
  let out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'one', '1')

  str = `{{nest|{{nest|two}}}}`
  out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'two', '2')

  str = `{{nest|{{nest|{{nest|three}}}}}}`
  out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'three', '3')

  str = `{{nest|{{nest|{{nest|{{nest|four}}}}}}}}`
  out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'four', '4')
  t.end()
})
