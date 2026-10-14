import test from 'tape'
import wtf from '../../lib/index.js'

test('Convert-Units-And-Ranges', (t) => {
  t.equal(wtf(`{{convert|70|m}}`).plaintext(), '70 m')
  t.equal(wtf(`{{convert|7|and|8|km}}`).plaintext(), '7 and 8 km')
  t.equal(wtf(`{{convert|7|to|8|mi}}`).plaintext(), '7 to 8 mi')
  t.end()
})
