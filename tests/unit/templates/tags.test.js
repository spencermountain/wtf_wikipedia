import test from 'tape'
import wtf from '../../lib/index.js'

test('Tag-Template-Content', (t) => {
  t.equal(wtf(`hello {{tag|ref|content=haha}} world`).text(), 'hello <ref >haha</ref> world', 'inline ref content')
  t.equal(wtf(`{{tag|ref|content=haha}}`).text(), '<ref >haha</ref>', 'ref content')
  t.equal(wtf(`{{tag|div|content=haha}}`).text(), 'haha', 'div content')
  t.end()
})
