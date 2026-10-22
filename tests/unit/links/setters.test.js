import test from 'tape'
import wtf from '../../lib/index.js'

test('link setters', (t) => {
  const link = wtf('hi [[Toronto|the six]]').links()[0]
  link.text('the 6ix')
  link.anchor('history')
  t.deepEqual(
    link.json(),
    { text: 'the 6ix', type: 'internal', page: 'Toronto', anchor: 'history' },
    'updated link JSON'
  )
  t.equal(link.href(), './Toronto#history', 'updated link URL')
  t.end()
})

test('external link shape', (t) => {
  const link = wtf('see [http://example.com/page a site]').links()[0]
  t.deepEqual(link.json(), { text: 'a site', type: 'external', site: 'http://example.com/page' }, 'external link JSON')
  t.equal(link.href(), 'http://example.com/page', 'external site')
  t.end()
})

test('link json includes the default display text', (t) => {
  const link = wtf('plain [[Rome]] link').links()[0]
  t.deepEqual(link.json(), { text: 'Rome', type: 'internal', page: 'Rome' }, 'page title supplies the text')
  t.equal(link.text(), 'Rome', 'link text matches JSON')
  t.end()
})
