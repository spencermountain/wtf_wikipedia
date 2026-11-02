import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('barrie', function (t) {
  const str = `'''[[Barrie]]''' is a city in Ontario, Canada.

'''Barrie''' may also refer to:

* [[Barrie (electoral district)]], Canadian federal electoral district
* [[Barrie (provincial electoral district)]], provincial electoral district
* [[Barrie—Simcoe—Bradford]], former Canadian electoral district
* [[Barrie School]], private school in Silver Spring, Maryland
* [[Barrie (company)]], fashion company owned by Chanel
* [[Little Barrie]], British band`

  const doc = wtf(str)
  const res = doc.disambiguation()
  t.equal(res.text, 'Barrie', 'text')
  t.equal(res.main, 'Barrie', 'main')
  t.equal(res.pages.length, 6, '6-pages')

  t.end()
})

test('barry', function (t) {
  const str = readPage('Barry')
  const doc = wtf(str)
  const res = doc.disambiguation()
  t.equal(res.text, 'Barry', 'text')
  t.equal(res.main, null, 'main')
  t.equal(res.pages.length, 33, '33-pages')

  t.end()
})
