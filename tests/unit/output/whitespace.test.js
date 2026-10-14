import test from 'tape'
import wtf from '../../lib/index.js'

test('long whitespace runs are trimmed', (t) => {
  t.equal(wtf(' '.repeat(100000) + 'word\t\n').text(), 'word')
  t.end()
})
