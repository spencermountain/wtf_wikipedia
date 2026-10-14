import test from 'tape'
import wtf from '../../lib/index.js'

test('Convert-Units-And-Ranges', (t) => {
  t.equal(wtf(`{{convert|70|m}}`).plaintext(), '70 m', 'single length')
  t.equal(wtf(`{{convert|7|and|8|km}}`).plaintext(), '7 and 8 km', 'and range')
  t.equal(wtf(`{{convert|7|to|8|mi}}`).plaintext(), '7 to 8 mi', 'to range')
  t.end()
})
