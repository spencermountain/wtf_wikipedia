import test from 'tape'
import wtf from '../../lib/index.js'

const paragraph = `hello. world. this is a test.
this is another sentence.
and one final one.`

// sentences

test('sentences - should return all sentences', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.sentences().map((s) => s.text())
  t.deepEqual(arr, [
    'hello.',
    'world.',
    'this is a test.',
    'this is another sentence.',
    'and one final one.',
  ], 'found 5 sentences')
  t.end()
})

// references
// Wrongly passing
// test.only('references - should return no references if there are none', (t) => {
//   const doc = wtf(paragraph)
//   const par = doc.paragraphs(0)[0]
//   console.log(doc.paragraphs()[0].references())
//   const arr = par.references().map((s) => s.text())
//   t.deepEqual(arr, [], 'found 0 references')
//   t.end()
// })

// test('references - should return all references', (t) => {
//   const doc = wtf(paragraph + `\n {{citation |url=cool.com/?fun=yes/no |title=cool title}}`)
//   const arr = doc.paragraphs()[0].references().map((s) => s.json())
//   t.deepEqual(arr, [{
//     url: 'cool.com/?fun=yes/no',
//     title: 'cool title',
//     template: 'citation'
//   }], 'found 1 reference')
//   t.end()
// })

// lists
test('lists - should return no lists if there are none', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.paragraphs()[0].lists().map((s) => s.text())
  t.deepEqual(arr, [], 'found 0 lists')
  t.end()
})

test('lists - should return all lists', (t) => {
  const doc = wtf(paragraph +
    `

a list:
* this is a list
* with two items
* and a third
    `,
  )

  const arr = doc.paragraphs()[1].lists().map((s) => s.json())
  t.deepEqual(arr, [[{ text: 'this is a list' }, { text: 'with two items' }, { text: 'and a third' }]], 'found 1 list')
  t.end()
})

// images
test('images - should return no images if there are none', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.paragraphs()[0].images().map((s) => s.json())
  t.deepEqual(arr, [], 'found 0 images')
  t.end()
})

test('images - should return all images', (t) => {
  const doc = wtf(paragraph +
    `

this is a image of the ferret [[File:ferret.jpg|thumb|300px|a ferret]]
    `,
  )

  t.deepEqual(doc.paragraphs()[1].images().map((s) => s.json()), [
    { file: 'File:ferret.jpg', thumb: 'https://wikipedia.org/wiki/Special:Redirect/file/Ferret.jpg?width=300', url: 'https://wikipedia.org/wiki/Special:Redirect/file/Ferret.jpg', caption: 'a ferret', links: [] },
  ], 'found 1 image')
  t.end()
})


// links
test('links - should return no links if there are none', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.paragraphs()[0].links().map((s) => s.json())
  t.deepEqual(arr, [], 'found 0 links')
  t.end()

})

test('links - should return all links', (t) => {
  const doc = wtf(paragraph +
    `

this is a link to [[wikipedia]]
`,
  )

  t.deepEqual(doc.paragraphs()[1].links().map((s) => s.json()), [
    { text: 'wikipedia', type: 'internal', page: 'wikipedia' },
  ], 'found 1 link')
  t.end()
})


// interwiki
test('interwiki - should return no interwiki if there are none', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.paragraphs()[0].interwiki().map((s) => s.json())
  t.deepEqual(arr, [], 'found 0 interwiki')
  t.end()
})

test('interwiki - should return all interwiki', (t) => {
  const doc = wtf(paragraph +
    `

this is a link to [[fr:wikipedia]]
`,
  )

  t.deepEqual(doc.paragraphs()[1].interwiki().map((s) => s.json()), [
    { text: 'wikipedia', type: 'interwiki', wiki: 'fr' },
  ], 'found 1 interwiki')
  t.end()
})

// text
test('text - should return all text', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.paragraphs()[0].text()
  t.equal(arr, 'hello. world. this is a test. this is another sentence. and one final one.', 'found all text')
  t.end()
})

// json
test('json - should return all json', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.paragraphs()[0].json()
  t.deepEqual(arr, {
    sentences: [
      { text: 'hello.' },
      { text: 'world.' },
      { text: 'this is a test.' },
      { text: 'this is another sentence.' },
      { text: 'and one final one.' },
    ],
  }, 'found all json')
  t.end()
})

// wikitext
test('wikitext - should return all wikitext', (t) => {
  const doc = wtf(paragraph)
  const arr = doc.paragraphs()[0].wikitext()
  t.equal(arr, paragraph, 'found all wikitext')
  t.end()
})

// aliases
// citations

