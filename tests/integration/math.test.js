import test from 'tape'
import wtf from '../lib/index.js'

test('math-simple', (t) => {
  let str = `hello {{math|big=1|1 + 2 {{=}} 3}} world`
  let doc = wtf(str)
  let tmpl = doc.template().json() || {}
  t.equal(tmpl.formula, '1 + 2 = 3', 'tmpl formula')
  t.equal(doc.text(), 'hello\n\n1 + 2 = 3\n\nworld', 'text output')

  str = `<math>y^3</math>`
  doc = wtf(str)
  tmpl = doc.template().json() || {}
  t.equal(tmpl.formula, 'y^3', 'xml inline')
  t.equal(doc.text(), 'y^3', 'xml inline output')

  str = `before <math>Gamma</math> between <math>Alpha</math> after`
  doc = wtf(str)
  t.equal(doc.templates().length, 2, 'got both math templates')
  t.equal(doc.text(), 'before Gamma between Alpha after', 'xml inline output')

  str = `<math display="inline">sum_{i=0}^infty 2^{-i}</math>`
  doc = wtf(str)
  tmpl = doc.template().json() || {}
  t.ok(tmpl.formula.length > 10, 'tmpl formula2')
  t.equal(doc.text(), '', 'no text output2')

  str = `<math>	ext{geometric series:}quad sum_{i=0}^infty 2^{-i}=2 </math>`
  doc = wtf(str)
  tmpl = doc.template().json() || {}
  t.ok(tmpl.formula.length > 10, 'tmpl formula3')
  t.equal(doc.text(), '', 'no text output3')
  t.end()
})

test('math-infobox', (t) => {
  let str = `{{Probability distribution
| name       = Complex Wishart
| type       =density
| notation   ={{math|''A'' ~ ''CW<sub>p</sub>''('''<math>\Gamma</math>''', ''n'')}}
| mean       =<math>\operatorname{E}[A]=n\Gamma</math>
}}
   
In [[statistics]], the '''complex Wishart distribution''' is a version of the [[Wishart distribution]]. 
`
  let doc = wtf(str)
  let want = `In statistics, the complex Wishart distribution is a version of the Wishart distribution.`
  t.equal(doc.text(), want, 'math infobox')
  t.end()
})

test('math-weirder', (t) => {
  const str = `<math>
  f(x) =
  egin{cases}
  1 & -1 le x < 0rac{1}{2} & x = 0 1 - x^2 & 	ext{otherwise}
  end{cases}
  </math>`
  const doc = wtf(str)
  const tmpl = doc.template().json() || {}
  t.ok(tmpl.formula.length > 10, 'tmpl formula')
  t.equal(doc.text(), '', 'no text output')
  t.end()
})
