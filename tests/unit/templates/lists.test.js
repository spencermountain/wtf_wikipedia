import test from 'tape'
import wtf from '../../lib/index.js'

test('List-Template-Text', (t) => {
  t.equal(wtf(`{{hlist|Winner|Runner-up|Third place|item_style=color:blue;|indent=2}}`).text(), 'Winner · Runner-up · Third place', 'horizontal list text')
  t.equal(wtf(`{{Ordered list |entry1 |entry2| entry3 }}`).text(), '1. entry1\n\n2. entry2\n\n3. entry3', 'ordered list text')
  t.equal(wtf(`{{unbulleted list|first item|second item|third item}}`).text(), 'first item\n\nsecond item\n\nthird item', 'unbulleted list text')
  t.end()
})
