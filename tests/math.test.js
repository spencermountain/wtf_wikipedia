var test = require('tape')
var wtf = require('./lib')

test('math-simple', t => {
  var str = `hello {{math|big=1|1 + 2 {{=}} 3}} world`
  var doc = wtf(str)
  var tmpl = doc.templates(0) || {}
  t.equal(tmpl.formula, '1 + 2 = 3', 'tmpl formula')
  t.equal(doc.text(), 'hello\n\n1 + 2 = 3\n\nworld', 'text output')

  str = `<math>y^3</math>`
  doc = wtf(str)
  tmpl = doc.templates(0) || {}
  t.equal(tmpl.formula, 'y^3', 'xml inline')
  t.equal(doc.text(), 'y^3', 'xml inline output')

  str = `<math display="inline">sum_{i=0}^infty 2^{-i}</math>`
  doc = wtf(str)
  tmpl = doc.templates(0) || {}
  t.ok(tmpl.formula.length > 10, 'tmpl formula2')
  t.equal(doc.text(), '', 'no text output2')

  str = `<math>	ext{geometric series:}quad sum_{i=0}^infty 2^{-i}=2 </math>`
  doc = wtf(str)
  tmpl = doc.templates(0) || {}
  t.ok(tmpl.formula.length > 10, 'tmpl formula3')
  t.equal(doc.text(), '', 'no text output3')
  t.end()
})

test('math-weirder', t => {
  var str = `<math>
  f(x) =
  egin{cases}
  1 & -1 le x < 0rac{1}{2} & x = 0 1 - x^2 & 	ext{otherwise}
  end{cases}
  </math>`
  var doc = wtf(str)
  var tmpl = doc.templates(0) || {}
  t.ok(tmpl.formula.length > 10, 'tmpl formula')
  t.equal(doc.text(), '', 'no text output')
  t.end()
})
