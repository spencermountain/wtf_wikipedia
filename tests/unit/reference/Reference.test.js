import test from 'tape'
import wtf from '../../lib/index.js'

// title
test('title - should return the title of the refrence', (t) => {
  let str = `{{cite web | title = The title of the reference | url = https://example.com | accessdate = 2019-01-01 }}`
  let doc = wtf(str)
  let ref = doc.references(0)[0]
  t.equal(ref.title(), 'The title of the reference', 'title')
  t.end()
})

// links
// Wrongly passing
test('links - should return the links of the refrence', (t) => {
  let str = `{{cite web | title = The title of the reference | url = https://example.com | accessdate = 2019-01-01 }}`
  let doc = wtf(str)
  let ref = doc.references(0)[0]
  t.deepEqual(ref.links(), [], 'links')
  t.end()
})

// text
test('text - should return the text of the refrence', (t) => {
  let str = `{{cite web | title = The title of the reference | url = https://example.com | accessdate = 2019-01-01 }}`
  let doc = wtf(str)
  let ref = doc.references(0)[0]
  t.equal(ref.text(), '', 'text')
  t.end()
})

// wikitext
test('wikitext - should return the wikitext of the refrence', (t) => {
  let str = `{{cite web | title = The title of the reference | url = https://example.com | accessdate = 2019-01-01 }}`
  let doc = wtf(str)
  let ref = doc.references(0)[0]
  t.equal(ref.wikitext(), str, 'wikitext')
  t.end()
})

// json
test('json - should return the json of the refrence', (t) => {
  let str = `{{cite web | title = The title of the reference | url = https://example.com | accessdate = 2019-01-01 }}`
  let doc = wtf(str)
  let ref = doc.references(0)[0]
  t.deepEqual(ref.json(), { title: 'The title of the reference', url: 'https://example.com', accessdate: '2019-01-01', template: 'citation', type: 'cite web' }, 'json')
  t.end()
})