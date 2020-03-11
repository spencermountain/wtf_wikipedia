var test = require('tape')
var wtf = require('./lib')

test('references', t => {
  var str = `John smith was a comedian<ref name="cool">{{cite web |url=http://supercool.com |title=John Smith sure was |last= |first= |date= |website= |publisher= |access-date= |quote=}}</ref>
and tap-dance pioneer. He was born in glasgow<ref>irelandtimes</ref>.

This is paragraph two.<ref>{{cite web |url=http://paragraphtwo.net}}</ref> It is the same deal.

==Section==
Here is the third paragraph. Nobody knows if this will work.<ref>[http://commonsense.com/everybody|says everybody]</ref>

`
  var doc = wtf(str)
  t.equal(doc.sections().length, 2, 'sections')
  t.equal(doc.paragraphs().length, 3, 'paragraphs')
  t.equal(doc.references().length, 4, 'all references')
  t.equal(doc.sections(0).references().length, 3, 'first references')
  t.end()
})

test('sentence/paragraphs by newlines', t => {
  var doc = wtf(`Leading text

Closing remark`)
  t.equal(doc.paragraphs().length, 2, '2 paragraphs')
  t.equal(doc.sentences().length, 2, '2 sentences')
  t.end()
})

test('bring newlines to plaintext', t => {
  var str = `hello



world`
  var doc = wtf(str)
  t.equal(doc.text(), 'hello\n\nworld', 'plaintext has one newline')
  t.end()
})

test('newlines in templates', t => {
  var str = `hello world{{cite web |url=http://coolc.om |title=whoa hello |last= |first=



|date= |website= |publisher= |access-date=


|quote=}}

Paragraph two!`
  var doc = wtf(str)
  t.equal(doc.paragraphs().length, 2, 'paragraphs')
  t.equal(doc.paragraphs(0).text(), 'hello world', 'first paragraph')
  t.equal(doc.paragraphs(1).text(), 'Paragraph two!', '2nd paragraph')
  t.end()
})

test('newlines in tables', t => {
  var str = `hello world. Up here.
{| class="wikitable"
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
|}

Second paragraph here.`
  var doc = wtf(str)
  t.equal(doc.paragraphs().length, 2, 'paragraphs')
  t.equal(doc.paragraphs(0).text(), 'hello world. Up here.', 'first paragraph')
  t.equal(doc.paragraphs(1).text(), 'Second paragraph here.', '2nd paragraph')
  t.equal(doc.tables().length, 1, 'got broken table')
  t.end()
})

test('cyrillic symbols', t => {
  var str = `== Заголовок ==
Соединённые

По «окончании»

После — четырёх

Лишённые

Спустя

В напряжённом`
  var doc = wtf(str)
  t.equal(doc.paragraphs().length, 6, 'paragraphs')
  t.equal(doc.paragraphs(0).text(), 'Соединённые', '1 paragraph')
  t.equal(doc.paragraphs(1).text(), 'По «окончании»', '2 paragraph')
  t.equal(doc.paragraphs(2).text(), 'После — четырёх', '3 paragraph')
  t.equal(doc.paragraphs(3).text(), 'Лишённые', '4 paragraph')
  t.equal(doc.paragraphs(4).text(), 'Спустя', '5 paragraph')
  t.equal(doc.paragraphs(5).text(), 'В напряжённом', '6 paragraph')
  t.end()
})
