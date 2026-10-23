import test from 'tape'
import wtf from '../../lib/index.js'

test('image JSON retains links in captions', (t) => {
  const image = wtf("[[File:Wikipedesketch1.png|thumb|The Wikipede edits ''[[Myriapoda]]''.]]").images()[0].json()
  t.equal(image.caption?.links?.[0]?.page, 'Myriapoda', 'caption link in serialized image')
  t.end()
})

test('image caption links agree with the image API', (t) => {
  const image = wtf('[[File:Example.png|thumb|A [[caption]]]]').images()[0]
  t.equal(image.json().caption.links[0].page, 'Caption', 'serialized caption link')
  t.equal(image.links()[0].page(), 'Caption', 'image API still returns Link objects')
  t.end()
})
