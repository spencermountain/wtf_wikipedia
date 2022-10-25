import test from 'tape'
import wtf from '../lib/index.js'

test('document-links', (t) => {
  const str = `before [[the shining|movie]]
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
  const links = wtf(str).links()
  t.equal(links.length, 3, 'found-all-links')
  t.ok(
    links.find((l) => l.text()),
    'movie',
    'link-text',
  )
  t.ok(
    links.find((l) => l.page()),
    'Minnesota Twins',
    'link-table',
  )
  t.ok(
    links.find((l) => l.page()),
    'three',
    'link-list',
  )
  t.end()
})

test('anchor-links', (t) => {
  let str = `[[Doug Ford#Personal Life]]`
  let link = wtf(str).link(0)
  t.equal(link.page(), 'Doug Ford', 'page1')
  t.equal(link.text(), 'Doug Ford', 'text1')
  t.equal(link.anchor(), 'Personal Life', 'anchor1')

  str = `[[Toronto_Blue_Jays#Problems|Tranno J birds]]`
  const doc = wtf(str)
  link = doc.link(0)
  t.equal(link.page(), 'Toronto_Blue_Jays', 'page2')
  t.equal(link.text(), 'Tranno J birds', 'text2')
  t.equal(link.anchor(), 'Problems', 'anchor2')

  // t.equal(
  //   doc.sentence().html(),
  //   '<span class="sentence"><a class="link" href="./Toronto_Blue_Jays#Problems">Tranno J birds</a></span>',
  //   'html-anchor'
  // )
  // t.equal(
  //   doc.sentence().markdown(),
  //   '[Tranno J birds](./Toronto_Blue_Jays#Problems)',
  //   'markdown-anchor'
  // )

  t.end()
})

test('title-case-links', (t) => {
  t.equal(wtf('[[john]]').link(0).page(), 'john', 'page')
  t.equal(wtf('[[john]]').link(0).text(), 'john', 'lowercase text')

  t.equal(wtf('[[John smith]]').link().page(), 'John smith', 'already titlecased')
  // t.equal(wtf('[[John]]').link().text(), undefined, 'no text stored when already titlecase')

  t.equal(wtf('[[john|his son]]').link().text(), 'his son', 'lowercase given text')
  t.equal(wtf('[[john|his son]]').link().page(), 'john', 'titlecase given page')
  t.equal(wtf('[[John|his son]]').link().page(), 'John', 'already titlecased given page')
  t.end()
})

test('remove styling in link text', (t) => {
  let doc = wtf(`[[cool|fun ''times'']]`)
  let txt = doc.link().text()
  t.equal(txt, `fun times`, 'no-italics')

  doc = wtf(`[[cool stuff|fun '''times''' now]]`)
  txt = doc.link().text()
  t.equal(txt, `fun times now`, 'no-bold')
  t.end()
})

test('tricksy-links', (t) => {
  const doc = wtf(`[[US]]9999.2`)
  t.equal(doc.text(), 'US9999.2', 'link-nospace')
  //   const doc = wtf('then [[John Entwistle|John [Entwistle]]] and I');
  //   t.equal(doc.link().page, 'John Entwistle', 'page without bracket');
  //   t.equal(doc.link().text, 'John [Entwistle]', 'text with bracket');
  t.end()
})
