import test from 'tape'
import wtf from '../../lib/index.js'

test('bulleted-list templates keep their items', (t) => {
  let str = wtf(`{{blist|3rd-round pick in 2002|5th-round pick in 2002}}`).text()
  t.equal(str.includes('3rd-round pick in 2002'), true, 'blist first item')
  t.equal(str.includes('5th-round pick'), true, 'blist second item')

  str = wtf(`{{bulleted list|one thing|another thing}}`).text()
  t.equal(str.includes('one thing'), true, 'bulleted-list first item')
  t.equal(str.includes('another thing'), true, 'bulleted-list second item')
  t.end()
})
