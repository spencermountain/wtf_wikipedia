import test from 'tape'
import wtf from '../../lib/index.js'

test('image JSON retains links in captions', (t) => {
  const image = wtf("[[File:Wikipedesketch1.png|thumb|The Wikipede edits ''[[Myriapoda]]''.]]").image().json()
  t.equal(image.links?.[0]?.page, 'Myriapoda', 'caption link in serialized image')
  t.end()
})

test('image JSON can omit caption links', (t) => {
  const image = wtf('[[File:Example.png|thumb|A [[caption]]]]').image()
  t.equal(image.json({ links: false }).links, undefined)
  t.equal(image.json().links[0].page, 'caption', 'options do not mutate subsequent output')
  t.equal(image.links()[0].page(), 'caption', 'image API still returns Link objects')
  t.end()
})
