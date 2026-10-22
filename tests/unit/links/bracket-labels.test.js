import test from 'tape'
import wtf from '../../lib/index.js'

// Recovered from links/links.test.js; use the current API.
test('brackets inside link labels', (t) => {
  const doc = wtf('then [[John Entwistle|John [Entwistle]]] and I')
  t.equal(doc.links()[0]?.page(), 'John Entwistle', 'target')
  t.equal(doc.links()[0]?.text(), 'John [Entwistle]', 'label retains its brackets')
  t.equal(doc.text(), 'then John [Entwistle] and I', 'surrounding text')
  t.end()
})

test('bracketed labels preserve suffixes and adjacent links', (t) => {
  const doc = wtf('[[Target|item [note]]]s and [[Next|next]]')
  t.deepEqual(doc.links().map((link) => [link.page(), link.text()]), [
    ['Target', 'item [note]s'],
    ['Next', 'next'],
  ],
    'link targets and labels')
  t.equal(doc.text(), 'item [note]s and next', 'text retains suffixes')
  t.end()
})
