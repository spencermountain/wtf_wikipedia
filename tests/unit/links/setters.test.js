import test from 'tape'
import wtf from '../../lib/index.js'

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
