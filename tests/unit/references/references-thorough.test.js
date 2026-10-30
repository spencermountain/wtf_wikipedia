import test from 'tape'
import wtf from '../../lib/index.js'

const refs = (str) => wtf(str).references()

test('references - named refs', (t) => {
  const str =
    'One here.<ref name="a">{{cite web|title=Alpha|url=http://a.com}}</ref> Two here.<ref name="a" /> Three here.<ref name=a/>'
  const doc = wtf(str)
  t.equal(doc.references().length, 1, 'reused named ref counted once')
  t.equal(doc.references()[0].title(), 'Alpha', 'named ref title')
  t.equal(doc.text(), 'One here. Two here. Three here.', 'ref tags removed from text')
  t.equal(doc.sentences().length, 3, 'self-closing refs do not glue sentences')

  const two = refs('A.<ref name="x">{{cite web|title=One}}</ref><ref name="y">{{cite web|title=Two}}</ref>')
  t.deepEqual(
    two.map((r) => r.title()),
    ['One', 'Two'],
    'adjacent named refs both kept in order'
  )

  const listDefined = refs(
    'A.<ref name="b"/>\n== Notes ==\n{{reflist|refs=<ref name="b">{{cite web|title=Defined}}</ref>}}'
  )
  t.deepEqual(
    listDefined.map((r) => r.title()),
    ['Defined'],
    'list-defined ref inside {{reflist|refs=}}'
  )
  t.end()
})

test('references - cite templates', (t) => {
  const book = refs('A.<ref>{{cite book|last=Smith|first=John|title=The Book|year=2001|publisher=Pub}}</ref>')[0].json()
  t.equal(book.template, 'cite book', 'cite book template')
  t.equal(book.kind, 'citation', 'citation kind')
  t.equal(book.data.last, 'Smith', 'last')
  t.equal(book.data.first, 'John', 'first')
  t.equal(book.data.title, 'The Book', 'title')
  t.equal(book.data.year, '2001', 'year')
  t.equal(book.data.publisher, 'Pub', 'publisher')

  const news = refs('A.<ref>{{cite news|author=Jane Doe|title=News Item|work=The Times|date=2020-01-01}}</ref>')[0]
  t.equal(news.title(), 'News Item', 'cite news title()')
  t.equal(news.json().data.author, 'Jane Doe', 'cite news author')
  t.equal(news.json().data.work, 'The Times', 'cite news work')
  t.equal(news.json().data.date, '2020-01-01', 'cite news date')

  const web = refs(
    'A.<ref>{{Cite web |url=https://x.org/page |title= Spaced  Title |access-date=1 May 2020}}</ref>'
  )[0].json()
  t.equal(web.data.url, 'https://x.org/page', 'url with spaces around =')
  t.equal(web.data.title, 'Spaced Title', 'title trimmed and whitespace collapsed')
  t.equal(web.data['access-date'], '1 May 2020', 'hyphenated parameter name')
  t.end()
})

test('references - plain and linked refs', (t) => {
  const plain = refs('A.<ref>Plain text ref.</ref>')[0]
  t.equal(plain.json().kind, 'reference', 'plain ref kind')
  t.equal(plain.json().data.inline.text, 'Plain text ref.', 'plain ref inline text')
  t.equal(plain.title(), '', 'plain ref has no title')

  const linked = refs('A.<ref>[http://example.com Example site]</ref>')[0]
  t.equal(linked.links().length, 1, 'external link inside ref')
  t.equal(linked.links()[0].type(), 'external', 'link is external')
  t.equal(linked.links()[0].text(), 'Example site', 'external link text')

  const group = refs('A.<ref group="note">A note.</ref> B.')
  t.equal(group.length, 1, 'grouped ref found')
  t.equal(group[0].json().data.inline.text, 'A note.', 'grouped ref text')
  t.end()
})

test('references - short footnotes', (t) => {
  const arr = refs('A.{{sfn|Smith|2001|p=5}} B.{{harvnb|Jones|1999|p=10}}')
  t.equal(arr.length, 2, 'sfn and harvnb are references')
  t.equal(arr[0].json().template, 'sfn', 'sfn template')
  t.equal(arr[0].json().data.author, 'Smith', 'sfn author')
  t.equal(arr[0].json().data.year, '2001', 'sfn year')
  t.equal(arr[0].json().data.p, '5', 'sfn page')
  t.equal(arr[1].json().template, 'harvnb', 'harvnb template')
  t.equal(arr[1].json().data.author, 'Jones', 'harvnb author')
  t.equal(wtf('A.{{sfn|Smith|2001|p=5}} B.').text(), 'A. B.', 'sfn removed from text')
  t.end()
})

test('references - location', (t) => {
  t.equal(refs('A.\n== References ==\n{{reflist}}').length, 0, '{{reflist}} alone is not a reference')
  const box = refs('{{Infobox person|name=Bob<ref>{{cite web|title=Infobox ref}}</ref>}}\nBob.')
  t.deepEqual(
    box.map((r) => r.title()),
    ['Infobox ref'],
    'ref inside an infobox'
  )
  const doc = wtf(
    'Intro.<ref>{{cite web|title=Intro ref}}</ref>\n== Later ==\nText.<ref>{{cite web|title=Later ref}}</ref>'
  )
  t.deepEqual(
    doc
      .section(0)
      .references()
      .map((r) => r.title()),
    ['Intro ref'],
    'section-scoped refs (intro)'
  )
  t.deepEqual(
    doc
      .section('Later')
      .references()
      .map((r) => r.title()),
    ['Later ref'],
    'section-scoped refs (later)'
  )
  t.deepEqual(
    doc.citations().map((r) => r.title()),
    ['Intro ref', 'Later ref'],
    'citations() alias, document order'
  )
  t.end()
})

test('references - fixed bugs', (t) => {
  // a named ref defined twice with identical content is one reference
  t.equal(refs('A.<ref name="q">Q.</ref>B.<ref name="q">Q.</ref>').length, 1, 'duplicate named definition counted once')
  // tag name casing leaks into output
  t.equal(refs('A.<REF>Upper case.</REF> B.')[0].json().template, 'ref', 'uppercase <REF> is normalised')
  // ref name and group attributes are dropped
  t.equal(refs('A.<ref name="a">{{cite web|title=Alpha}}</ref>')[0].json().name, 'a', 'ref name attribute is kept')
  t.equal(refs('A.<ref group="note">A note.</ref>')[0].json().group, 'note', 'ref group attribute is kept')
  t.end()
})
