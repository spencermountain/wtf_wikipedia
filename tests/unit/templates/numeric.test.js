import test from 'tape'
import wtf from '../../lib/index.js'

test('numeric templates preserve precision', (t) => {
  const cases = [
    ['{{Winning percentage|100|50|leading_zero=y}}', '0.667'],
    ['{{winpct|1293|844|139}}', '.599'],
    ['{{Order of magnitude|.1234}}', '-1'],
    ['{{Round|54.376|2}}', '54.38'],
    ['{{Rounddown|3.14159|3}}', '3.141'],
    ['{{Rounddown|314159|-3}}', '314000'],
    ['{{Round|0|2}}', '0'],
    ['{{Round|1.005|2}}', '1.01'],
    ['{{Roundup|3.14159|3}}', '3.142'],
    ['{{Rounddown|-3.14159|3}}', '-3.142'],
    ['{{Winning percentage|0|10}}', '.000'],
    ['{{Winning percentage|10|0}}', '1.000'],
    ['{{Winning percentage|0|0}}', ''],
  ]
  cases.forEach(([input, expected]) => {
    t.equal(wtf(input).text(), expected, input)
  })
  t.end()
})
