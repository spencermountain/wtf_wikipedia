import test from 'tape'
import wtf from '../../lib/index.js'

test('nested template arguments retain their boundaries', (t) => {
  const box = wtf('{{Infobox test|first=[[outer|inner]]|second={{nowrap|x}}|third=end}}').infobox()
  t.deepEqual(['first', 'second', 'third'].map((key) => box.get(key).text()), ['inner', 'x', 'end'], 'nested argument values')
  const long = '['.repeat(100000)
  const unclosed = wtf('{{Infobox test|first=' + long + '|value}}').infobox()
  t.equal(unclosed.get('first').text(), long + '|value', 'unclosed delimiters keep their pipe')
  t.end()
})
