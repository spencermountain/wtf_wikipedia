import test from 'tape'
import wtf from '../../lib/index.js'

test('link setters', (t) => {
  const link = wtf('hi [[Toronto|the six]]').links()[0]
  link.text('the 6ix')
  link.anchor('history')
  t.deepEqual(link.json(), { text: 'the 6ix', type: 'internal', page: 'Toronto', anchor: 'history' })
  t.equal(link.href(), './Toronto#history')
  t.end()
})

test('external link shape', (t) => {
  const link = wtf('see [http://example.com/page a site]').links()[0]
  t.deepEqual(link.json(), { text: 'a site', type: 'external', site: 'http://example.com/page' })
  t.equal(link.site(), 'http://example.com/page')
  t.end()
})

test('link json has no undefined text key', (t) => {
  const link = wtf('plain [[Rome]] link').links()[0]
  t.deepEqual(Object.keys(link.json()), ['type', 'page'], 'text key absent when there is no display text')
  t.end()
})
