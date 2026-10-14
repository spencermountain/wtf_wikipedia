import test from 'tape'
import wtf from '../../lib/index.js'

test('sentence text setter', (t) => {
  const s = wtf('Hello world.').sentences()[0]
  s.text('Goodbye world.')
  t.equal(s.text(), 'Goodbye world.', 'updated sentence text')
  t.end()
})

test('sentence formatting misses are null', (t) => {
  const s = wtf('no formatting here.').sentences()[0]
  t.equal(s.bold(), null, 'missing bold')
  t.equal(s.italic(), null, 'missing italic')
  t.equal(s.link(), null, 'missing link')
  t.deepEqual(s.bolds(), [], 'empty bold collection')
  t.deepEqual(s.italics(), [], 'empty italic collection')
  t.end()
})
