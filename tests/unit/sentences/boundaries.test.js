import test from 'tape'
import wtf from '../../lib/index.js'

test('sentence boundaries survive punctuation and line terminators', (t) => {
  const sentences = (text) => wtf(text).sentences().map((sentence) => sentence.text())
  t.deepEqual(sentences('One sentence. Another sentence!'), ['One sentence.', 'Another sentence!'])
  t.deepEqual(sentences('x.\r\nNext sentence.\u2028Last one?'), ['x.', 'Next sentence.', 'Last one?'])
  t.deepEqual(sentences('... Wait for it. "Done now!"'), ['... Wait for it.', '"Done now!"'])
  const long = 'word '.repeat(20000)
  t.deepEqual(sentences(long), [long.trim()], 'long text without punctuation stays intact')
  t.end()
})
