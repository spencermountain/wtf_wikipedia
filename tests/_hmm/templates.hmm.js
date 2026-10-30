import test from 'tape'
import wtf from '../lib/index.js'

// Recovered from templates-inline.test.js, including cases removed during cleanup.
test('template text limitations', (t) => {
  const cases = [
    ['{{decdeg|119.5666667|||W}}', '-119.5666667°'],
    ['{{decdeg|deg=37|min=51|sec=00|hem=N}}', '37.85°'],
    ['{{;}}', ';'],
    ["{{math|''f''(''x'') {{=}} ''b''<sup>''x''</sup> {{=}} ''y''}}", 'f(x) = b x = y'],
  ]
  cases.forEach(([input, expected]) => {
    t.equal(wtf(input).text(), expected, input)
  })
  t.end()
})
