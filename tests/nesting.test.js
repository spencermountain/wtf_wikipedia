var test = require('tape')
var wtf = require('./lib')

wtf.extend((models, templates) => {
  templates.trynest = 0
})

test('nesting-test', t => {
  let str = `{{tryNest|one}}`

  let out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'one', 'nest-1')

  str = `{{tryNest|{{tryNest|two}}}}`
  out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'two', 'nest-2')

  str = `{{tryNest|{{tryNest|{{tryNest|three}}}}}}`
  out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'three', 'nest-3')

  str = `{{tryNest|{{tryNest|{{tryNest|{{tryNest|four}}}}}}}}`
  out = wtf(str)
    .text()
    .trim()
  t.equal(out, 'four', 'nest-4')
  t.end()
})
