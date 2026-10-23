import test from 'tape'
import wtf from '../lib/index.js'

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

