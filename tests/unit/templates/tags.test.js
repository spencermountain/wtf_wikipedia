import test from 'tape'
import wtf from '../../lib/index.js'

test('Tag-Template-Content', (t) => {
  t.equal(wtf(`hello {{tag|ref|content=haha}} world`).plaintext(), 'hello <ref >haha</ref> world', 'inline ref content')
  t.equal(wtf(`{{tag|ref|content=haha}}`).plaintext(), '<ref >haha</ref>', 'ref content')
  t.equal(wtf(`{{tag|div|content=haha}}`).plaintext(), 'haha', 'div content')
  t.end()
})
