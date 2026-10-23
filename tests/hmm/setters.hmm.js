import test from 'tape'
import wtf from '../lib/index.js'

test('sentence text setter', (t) => {
  const s = wtf('Hello world.').sentences()[0]
  s.text('Goodbye world.')
  t.equal(s.text(), 'Goodbye world.', 'updated sentence text')
  t.end()
})

test('sentence formatting misses are null', (t) => {
  const s = wtf('no formatting here.').sentences()[0]
  t.equal(s.bolds()[0], null, 'missing bold')
  t.equal(s.italics()[0], null, 'missing italic')
  t.equal(s.links()[0], undefined, 'missing link')
  t.deepEqual(s.bolds(), [], 'empty bold collection')
  t.deepEqual(s.italics(), [], 'empty italic collection')
  t.end()
})
