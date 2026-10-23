import test from 'tape'
import wtf from '../../lib/index.js'

test('Nastaliq renders formatted content as text', (t) => {
  const doc = wtf("Before {{Nastaliq|'''ایوانِ بالا پاکستان'''}} after.")
  t.equal(doc.text(), 'Before ایوانِ بالا پاکستان after.', 'Urdu text stays in the sentence')
  t.equal(wtf('{{nastaliq|پاکستان}}').text(), 'پاکستان', 'lowercase template name is supported')
  t.end()
})

test('Nastaliq preserves text inside an infobox', (t) => {
  const doc = wtf("{{Infobox legislature|name=Senate of Pakistan<br>{{Nastaliq|'''ایوانِ بالا پاکستان'''}}}}")
  const name = doc.infobox().get('name').text
  t.match(name, /Senate of Pakistan/, 'English name remains')
  t.match(name, /ایوانِ بالا پاکستان/, 'Urdu name remains')
  t.end()
})

test('empty Nastaliq templates contribute no text', (t) => {
  t.equal(wtf('Before {{nastaliq|}} after.').text(), 'Before after.', 'empty Nastaliq text')
  t.end()
})
