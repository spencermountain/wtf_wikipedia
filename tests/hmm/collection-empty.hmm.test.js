import test from 'tape'
import wtf from '../../src/index.ts'

test('collection isEmpty counts items', (t) => {
  const doc = wtf('[[Toronto]]')
  t.equal(doc.links().isEmpty(), false, 'populated collection')
  t.equal(doc.links('missing').isEmpty(), true, 'missing match')
  t.equal(doc.links(99).isEmpty(), true, 'missing index')
  t.equal(
    doc
      .links()
      .filter(() => false)
      .isEmpty(),
    true,
    'filtered collection'
  )
  t.equal(doc.links().slice(0, 0).isEmpty(), true, 'empty slice')
  t.equal(wtf('').paragraphs().isEmpty(), true, 'empty generic collection')
  t.equal(doc.links()[0].page(), 'Toronto', 'singular accessor returns model')
  t.equal(doc.links().find((link) => link.page() === 'missing'), undefined, 'missing link is undefined')
  t.end()
})
