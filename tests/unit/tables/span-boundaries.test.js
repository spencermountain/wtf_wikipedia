import test from 'tape'
import wtf from '../../lib/index.js'

test('table spans retain their boundaries with prefixed attributes', (t) => {
  const doc = wtf(`{| class="wikitable"
! A !! B !! C
|-
| prefix colspan="2" | value || next
|}`)
  const have = doc.tables()[0].rows()
  t.deepEqual(have, [{ a: 'value', b: '', c: 'next' }], 'spanned cell text')
  t.end()
})
