import test from 'tape'
import wtf from '../lib/index.js'

test('wikitext', (t) => {
  let str = `'''K. Nicole Mitchell''' is ''currently'' a [[U.S. Magistrate Judge]].

	She is '''''very''''' good`
  let doc = wtf(str)
  t.equal(doc.wikitext(), str, 'doc-wikitext')
  t.equal(doc.section().wikitext(), str, 'section-wikitext')
  let first = `'''K. Nicole Mitchell''' is ''currently'' a [[U.S. Magistrate Judge]].`
  t.equal(doc.paragraph().wikitext(), first, 'paragraph-wikitext')
  t.equal(doc.sentence().wikitext(), first, 'sentence-wikitext')
  t.equal(doc.link().wikitext(), `[[U.S. Magistrate Judge]]`, 'sentence-wikitext')

  str = 'hello [[File:cool.svg|yeah]] after'
  doc = wtf(str)
  t.equal(doc.image().wikitext(), `[[File:cool.svg|yeah]]`, 'image-wikitext')

  str = `* one
* Two  
* three`
  doc = wtf(str)
  t.equal(doc.list().wikitext(), str, 'list-wikitext')
  t.end()
})

test('table-get', (t) => {
  let str = `{| class="wikitable"
|-
! Header 1
! Header 2
! Header 3
|-
| row 1, cell 1
| row 1, cell 2
| row 1, cell 3
|-
| row 2, cell 1
| row 2, cell 2
| row 2, cell 3
|-
| row 3, cell 1
| row 3, cell 2
| row 3, cell 3
|}`
  let doc = wtf(str)
  let data = doc.table().get('header 2')
  t.deepEqual(data, ['row 1, cell 2', 'row 2, cell 2', 'row 3, cell 2'])

  data = doc.table().get(['header 2', 'asdf', 'Header 1'])
  t.equal(data.length, 3, 'still three')
  t.equal(Object.keys(data).length, 3, 'three keys')

  t.equal(doc.table().wikitext(), str, 'table-wikitext')
  t.end()
})

test('template methods', (t) => {
  let doc = wtf(`* {{USS|Barry}}, four US destroyers`)
  let tmpl = doc.template()
  t.equal(tmpl.wikitext(), '{{USS|Barry}}', 'tmpl wikitext')
  t.equal(tmpl.text(), `USS Barry`, 'tmpl text')
  t.end()
})

test('reference method', (t) => {
  let str = `<ref>{{cite web|title=The princess of pot|url=http://thewalrus.ca/the-princess-of-pot/}}</ref>`
  let doc = wtf(`the end.` + str)
  let tmpl = doc.reference()
  t.equal(tmpl.wikitext(), str, 'ref wikitext')
  t.equal(tmpl.text(), ``, 'ref text')
  t.end()
})
