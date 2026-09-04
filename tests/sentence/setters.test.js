import test from 'tape'
import wtf from '../lib/index.js'

test('sentence text setter', (t) => {
  const s = wtf('Hello world.').sentences()[0]
  s.text('Goodbye world.')
  t.equal(s.text(), 'Goodbye world.')
  t.end()
})

test('sentence formatting misses are null', (t) => {
  const s = wtf('no formatting here.').sentences()[0]
  t.equal(s.bold(), null)
  t.equal(s.italic(), null)
  t.equal(s.link(), null)
  t.deepEqual(s.bolds(), [])
  t.deepEqual(s.italics(), [])
  t.end()
})
