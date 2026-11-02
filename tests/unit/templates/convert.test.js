import test from 'tape'
import wtf from '../../lib/index.js'

test('Convert-Units-And-Ranges', (t) => {
  t.equal(wtf(`{{convert|70|m}}`).text(), '70 metres (230 ft)', 'single length')
  t.equal(wtf(`{{convert|7|and|8|km}}`).text(), '7 and 8 kilometres', 'and range')
  t.equal(wtf(`{{convert|7|to|8|mi}}`).text(), '7 to 8 miles', 'to range')
  t.end()
})
