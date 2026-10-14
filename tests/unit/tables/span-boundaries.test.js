import test from 'tape'
import wtf from '../../lib/index.js'

test('table spans retain their boundaries with prefixed attributes', (t) => {
  const doc = wtf(`{| class="wikitable"
! A !! B !! C
|-
| prefix colspan="2" | value || next
|}`)
  t.deepEqual(doc.table().data.map((row) => Object.values(row).map((cell) => cell.text())), [['value', '', 'next']])
  t.end()
})
