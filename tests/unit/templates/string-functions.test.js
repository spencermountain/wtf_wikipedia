import test from 'tape'
import wtf from '../../lib/index.js'

test('String-Template-Functions', (t) => {
  t.equal(wtf(`{{first word|Foo bar baz}}`).text(), 'Foo', 'first word')
  t.equal(wtf(`{{Trunc | Lorem ipsum dolor sit amet | 10 }}`).text(), 'Lorem ipsu', 'truncated string')
  t.equal(wtf(`{{str mid|Abcdefghijklmnopqrstuvwxyz|5|3}}`).text(), 'efg', 'middle substring')
  t.end()
})

test('Plural-Template-Forms', (t) => {
  t.equal(wtf(`{{plural|1|page}}`).text(), '1 page', 'singular form')
  t.equal(wtf(`{{plural|1.5|page}}`).text(), '1.5 pages', 'fractional plural')
  t.equal(wtf(`{{plural|20|fly}}`).text(), '20 flies', 'plural ending')
  t.end()
})
