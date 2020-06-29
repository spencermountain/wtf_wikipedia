var test = require('tape')
var wtf = require('./lib')

test('document-links', (t) => {
  var str = `before [[the shining|movie]]
{|
! h1 !! h2 || h3
|-
| one
| two
| three
|-
|  [[Minnesota Twins|Twins]]
| five
| six
|}

after now
* one
* two
* [[three]]
* four
`
  var links = wtf(str).links()
  t.equal(links.length, 3, 'found-all-links')
  t.ok(
    links.find((l) => l.text()),
    'movie',
    'link-text'
  )
  t.ok(
    links.find((l) => l.page()),
    'Minnesota Twins',
    'link-table'
  )
  t.ok(
    links.find((l) => l.page()),
    'three',
    'link-list'
  )
  t.end()
})

test('anchor-links', (t) => {
  var str = `[[Doug Ford#Personal Life]]`
  var link = wtf(str).links(0)
  t.equal(link.page(), 'Doug Ford', 'page1')
  t.equal(link.text(), undefined, 'text1')
  t.equal(link.anchor(), 'Personal Life', 'anchor1')

  str = `[[Toronto_Blue_Jays#Problems|Tranno J birds]]`
  var doc = wtf(str)
  link = doc.links(0)
  t.equal(link.page(), 'Toronto_Blue_Jays', 'page2')
  t.equal(link.text(), 'Tranno J birds', 'text2')
  t.equal(link.anchor(), 'Problems', 'anchor2')

  // t.equal(
  //   doc.sentences(0).html(),
  //   '<span class="sentence"><a class="link" href="./Toronto_Blue_Jays#Problems">Tranno J birds</a></span>',
  //   'html-anchor'
  // )
  // t.equal(
  //   doc.sentences(0).markdown(),
  //   '[Tranno J birds](./Toronto_Blue_Jays#Problems)',
  //   'markdown-anchor'
  // )

  t.end()
})

test('title-case-links', (t) => {
  t.equal(wtf('[[john]]').links(0).page(), 'john', 'page')
  t.equal(wtf('[[john]]').links(0).text(), 'john', 'lowercase text')

  t.equal(wtf('[[John smith]]').links(0).page(), 'John smith', 'already titlecased')
  t.equal(wtf('[[John]]').links(0).text(), undefined, 'no text stored when already titlecase')

  t.equal(wtf('[[john|his son]]').links(0).text(), 'his son', 'lowercase given text')
  t.equal(wtf('[[john|his son]]').links(0).page(), 'john', 'titlecase given page')
  t.equal(wtf('[[John|his son]]').links(0).page(), 'John', 'already titlecased given page')
  t.end()
})

test('tricksy-links', (t) => {
  var doc = wtf(`[[US]]9999.2`)
  t.equal(doc.text(), 'US9999.2', 'link-nospace')
  //   var doc = wtf('then [[John Entwistle|John [Entwistle]]] and I');
  //   t.equal(doc.links(0).page, 'John Entwistle', 'page without bracket');
  //   t.equal(doc.links(0).text, 'John [Entwistle]', 'text with bracket');
  t.end()
})
