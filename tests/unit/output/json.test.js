import test from 'tape'
import readFile from '../../lib/_cachedPage.js'

test('json-output-default', (t) => {
  const data = readFile('Royal-Cinema').json()
  t.ok(data.title, 'title-exists')
  t.ok(data.categories, 'categories-exists')
  t.ok(data.sections, 'sections-exists')
  t.ok(!data.images, 'images-exists')
  t.ok(!data.citations, 'citations-exists')
  t.ok(!data.infoboxes, 'infoboxes-exists')
  t.end()
})

test('section-output', (t) => {
  const doc = readFile('Royal-Cinema')
  const data = doc.paragraphs()[0].json()
  t.ok(data.sentences[0].text, 'sentence text')
  t.ok(data.sentences[0].links, 'sentence links')
  t.end()
})

test('sentence-output', (t) => {
  const doc = readFile('Royal-Cinema')
  const sen = doc.sentences()[0]
  const data = sen.json()
  t.ok(data.text, 'text')
  t.ok(data.links, 'links')
  t.ok(data.bolds, 'bold formatting')
  t.end()
})
