import test from 'tape'
import wtf from '../../lib/index.js'

test('Original-Wikitext', (t) => {
  let str = `'''K. Nicole Mitchell''' is ''currently'' a [[U.S. Magistrate Judge]].

	She is '''''very''''' good`
  let doc = wtf(str)
  t.equal(doc.wikitext(), str, 'doc-wikitext')
  t.equal(doc.section().wikitext(), str, 'section-wikitext')
  const first = `'''K. Nicole Mitchell''' is ''currently'' a [[U.S. Magistrate Judge]].`
  t.equal(doc.paragraphs()[0].wikitext(), first, 'paragraph-wikitext')
  t.equal(doc.sentence().wikitext(), first, 'sentence-wikitext')
  t.equal(doc.links()[0].wikitext(), `[[U.S. Magistrate Judge]]`, 'sentence-wikitext')

  str = 'hello [[File:cool.svg|yeah]] after'
  doc = wtf(str)
  t.equal(doc.images()[0].wikitext(), `[[File:cool.svg|yeah]]`, 'image-wikitext')

  str = `* one
* Two  
* three`
  doc = wtf(str)
  t.equal(doc.lists()[0].wikitext(), str, 'list-wikitext')
  t.end()
})
