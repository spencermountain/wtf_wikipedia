import test from 'tape'
import wtf from '../lib/index.js'

test('categories - get - if the clue is not a number return the list of categories', (t) => {
  const doc = wtf(`
    [[Category:WWE Hall of Fame inductees]]
    [[Category:Writers from New York City]]
    [[Category:American people of German descent]]
    [[Category:American people of Scottish descent]]
  `)
  const expected = [
    'WWE Hall of Fame inductees',
    'Writers from New York City',
    'American people of German descent',
    'American people of Scottish descent',
  ]
  t.deepEqual(doc.categories('string'), expected, 'the categories in the wiki text')
  t.end()
})

// test('sections - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.sections().length === 0, 'the sections collection is empty')
//   t.end()
// })

// test('sections - get - if the sections is in the option. ignore it', (t) => {
//   const doc = wtf('', { sections: ['Q42'] })
//   t.ok(doc.sections().length === 0, 'the sections collection is empty')
//   t.end()
// })

// test('paragraphs - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.paragraphs().length === 0, 'the paragraphs collection is empty')
//   t.end()
// })

// test('paragraphs - get - if the paragraphs is in the option. ignore it', (t) => {
//   const doc = wtf('', { paragraphs: ['Q42'] })
//   t.ok(doc.paragraphs().length === 0, 'the paragraphs collection is empty')
//   t.end()
// })

// test('sentences - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.sentences().length === 0, 'the sentences collection is empty')
//   t.end()
// })

// test('sentences - get - if the sentences is in the option. ignore it', (t) => {
//   const doc = wtf('', { sentences: ['Q42'] })
//   t.ok(doc.sentences().length === 0, 'the sentences collection is empty')
//   t.end()
// })

// test('sentences - get - unsupported string selector returns an empty collection', (t) => {
//   t.ok(page.sentences('string').length === 0, 'unsupported string selector returns no sentences')
//   t.end()
// })

// test('images - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.images().length === 0, 'the images collection is empty')
//   t.end()
// })

// test('images - get - if the images is in the option. ignore it', (t) => {
//   const doc = wtf('', { images: ['Q42'] })
//   t.ok(doc.images().length === 0, 'the images collection is empty')
//   t.end()
// })

// test('links - get - unsupported selector returns an empty collection', (t) => {
//   t.ok(page.links([]).length === 0, 'unsupported selector returns no links')
//   t.end()
// })
