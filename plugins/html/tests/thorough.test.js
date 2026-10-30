import test from 'tape'
import wtf from './_lib.js'

const tidy = (str) => str.replace(/\s+/g, ' ').replace(/> </g, '><').trim()
const has = (t, html, part, msg) => t.ok(tidy(html).includes(tidy(part)), msg)

test('html: sections and headings', (t) => {
  const html = wtf('intro text here.\n\n== History ==\nOld stuff happened.\n=== Early ===\nVery old stuff.').html()
  t.equal((html.match(/<div class="section">/g) || []).length, 3, 'one div per section')
  t.notOk(/<h\d>\s*<\/h\d>/.test(html), 'intro has no empty header')
  t.ok(html.indexOf('History') < html.indexOf('Early'), 'sections in order')
  has(t, html, '<span class="sentence">Old stuff happened.</span>', 'section text')
  const noHeaders = wtf('intro.\n== History ==\nOld stuff.').html({ headers: false })
  t.notOk(/<h\d>/.test(noHeaders), 'headers:false')
  t.end()
})

test('html: section header levels match wikitext', { todo: true }, (t) => {
  const html = wtf('intro.\n== History ==\nOld.\n=== Early ===\nOlder.').html()
  has(t, html, '<h2>History</h2>', '== heading → h2')
  has(t, html, '<h3>Early</h3>', '=== heading → h3')
  t.end()
})

test('html: paragraphs and sentences', (t) => {
  const doc = wtf('The cat sat down. The dog ran away.\n\nA second paragraph here.')
  const html = doc.html()
  t.equal((html.match(/<p class="paragraph">/g) || []).length, 2, 'two paragraphs')
  t.equal((html.match(/<span class="sentence">/g) || []).length, 3, 'three sentences')
  t.equal(doc.sentences()[1].html(), '<span class="sentence">The dog ran away.</span>', 'sentence.html()')
  t.equal(
    doc.paragraphs()[0].html(),
    '<span class="sentence">The cat sat down.</span>\n<span class="sentence">The dog ran away.</span>',
    'paragraph.html()'
  )
  const flat = doc.sections()[0].html({ paragraphs: false, sentences: true })
  t.notOk(flat.includes('<p'), 'sentences mode has no <p>')
  t.ok(flat.includes('The dog ran away.'), 'sentences mode has text')
  t.equal(doc.html({ sections: false }), '', 'sections:false → nothing')
  t.end()
})

test('html: links', (t) => {
  t.equal(wtf('[[Foo bar|baz]]').links()[0].html(), '<a class="link" href="./Foo_bar">baz</a>', 'piped link')
  has(
    t,
    wtf('see [[Toronto#History|history]] here').html(),
    '<a class="link" href="./Toronto#History">history</a>',
    'anchor'
  )
  has(
    t,
    wtf('see [https://example.com Example site] now').html(),
    '<a class="link" href="https://example.com">Example site</a>',
    'external link'
  )
  has(t, wtf('a [[wikt:cat]] b').html(), 'href="http://en.wiktionary.org/wiki/cat"', 'interwiki link')
  t.notOk(wtf('see [[fr:Paris]] here').html().includes('fr:Paris'), 'interlanguage link not rendered')
  const esc = wtf('[[A "quoted" <x>|a "q" <x>]]').links()[0].html()
  t.ok(esc.includes('a &quot;q&quot; &lt;x&gt;'), 'link text escaped')
  const href = esc.match(/href="([^"]*)"/)[1]
  t.notOk(/[<>]/.test(href), 'href has no raw brackets')
  const off = wtf("a '''b''' [[c]]").html({ links: false, formatting: false })
  has(t, off, '<span class="sentence">a b c</span>', 'links:false + formatting:false')
  t.end()
})

test('html: link to the right occurrence', { todo: true }, (t) => {
  has(
    t,
    wtf('the cat and the [[cat]]').html(),
    'the cat and the <a class="link" href="./Cat">cat</a>',
    'second "cat" is the link'
  )
  t.end()
})

test('html: formatting', (t) => {
  has(t, wtf("an ''italic'' word").html(), 'an <i>italic</i> word', 'italic')
  has(t, wtf("a '''bold''' word").html(), 'a <b>bold</b> word', 'bold')
  t.end()
})

test('html: bold link', (t) => {
  has(
    t,
    wtf("a '''[[Paris]]''' trip").html(),
    '<b><a class="link" href="./Paris">Paris</a></b>',
    'bold link keeps a clean href'
  )
  t.end()
})

test('html: escapes plain text', (t) => {
  has(t, wtf('if a < b & c > d then').html(), 'if a &lt; b &amp; c &gt; d then', 'sentence text is html-escaped')
  t.end()
})

test('html: lists', (t) => {
  const html = wtf("intro\n* one [[A]]\n* two ''it''\n").html()
  has(t, html, '<ul class="list">', 'ul')
  t.equal((html.match(/<li>/g) || []).length, 2, 'two items')
  has(t, html, '<li><span class="sentence">one <a class="link" href="./A">A</a></span></li>', 'link in item')
  has(t, html, '<i>it</i>', 'italic in item')
  t.notOk(wtf('intro\n* one\n').html({ lists: false }).includes('<ul'), 'lists:false')
  t.end()
})

test('html: images', (t) => {
  const html = wtf('[[File:Cat.jpg|thumb|A cat]] text').html()
  has(t, html, '<img src="https://wikipedia.org/wiki/Special:Redirect/file/Cat.jpg?width=300" alt="Cat"/>', 'img tag')
  t.notOk(wtf('[[File:Cat.jpg|thumb|A cat]] text').html({ images: false }).includes('<img'), 'images:false')
  t.end()
})

test('html: infobox', (t) => {
  const doc = wtf(
    '{{Infobox person\n| name = Joe\n| birth_place = [[Paris]]\n| image = Joe.jpg\n| caption = Joe in 2000\n}} text'
  )
  const html = doc.html()
  t.ok(html.indexOf('class="infobox"') < html.indexOf('class="section"'), 'infobox rendered first')
  has(t, html, '<td>Birth place</td>', 'key humanized')
  has(t, html, '<a class="link" href="./Paris">Paris</a>', 'link in value')
  has(t, html, 'alt="Joe"', 'infobox image')
  has(t, html, 'Joe in 2000', 'caption')
  t.notOk(html.includes('<td>Image</td>'), 'image key not repeated as a row')
  t.notOk(doc.html({ infoboxes: false }).includes('infobox'), 'infoboxes:false')
  t.end()
})

test('html: references', (t) => {
  const doc = wtf(
    'text one.<ref>{{cite web|url=https://a.com|title=A title}}</ref> more two.<ref>{{cite book|title=Book|author=Smith}}</ref> plain three.<ref>just <text></ref>'
  )
  t.notOk(doc.html().includes('References'), 'references off by default')
  const html = doc.html({ references: true })
  has(t, html, '<h2>References</h2>', 'references header')
  has(t, html, '<div class="reference">⌃ <a href="https://a.com">A title</a> </div>', 'cite web')
  has(t, html, '<div class="reference">⌃ just &lt;text&gt;</div>', 'inline ref text escaped')
  t.end()
})

test('html: reference rendering', (t) => {
  const doc = wtf(
    'a.<ref>{{cite web|url=https://a.com|title=A title}}</ref> b.<ref>{{cite book|title=Book|author=Smith}}</ref>'
  )
  t.doesNotThrow(() => doc.references()[0].html(), 'reference.html() without options should not throw')
  has(t, doc.html({ references: true }), '⌃ Book Smith', 'cite book title and author separated')
  t.end()
})

test('html: tables', (t) => {
  const html = wtf(`{| class="wikitable"
! Team !! Wins
|-
| [[Toronto Raptors|Raptors]] || 59
|}`).html()
  has(t, html, '<table class="table">', 'table')
  has(t, html, '<td>Team</td>', 'header cell')
  has(t, html, '<a class="link" href="./Toronto_Raptors">Raptors</a>', 'link in cell')
  has(t, html, '59', 'number cell')
  t.notOk(wtf(`{|\n! a\n|-\n| b\n|}`).html({ tables: false }).includes('<table'), 'tables:false')
  t.end()
})

test('html: title and redirects', (t) => {
  has(t, wtf('hello', { title: 'My Page' }).html(), '<title>My Page</title>', 'title tag from doc.title')
  has(
    t,
    wtf('#REDIRECT [[Toronto Maple Leafs#History|leafs]]').html(),
    'href="./Toronto_Maple_Leafs#History"',
    'redirect href has one ./'
  )
  t.end()
})

test('html: redirect soft landing', (t) => {
  const html = wtf('#REDIRECT [[Toronto Maple Leafs]]').html()
  has(t, html, '<div class="redirect">', 'redirect div')
  t.ok(html.includes('Toronto_Maple_Leafs'), 'redirect target')
  t.notOk(html.includes('class="section"'), 'no sections for redirect')
  t.end()
})

test('html: content order', { todo: true }, (t) => {
  const html = tidy(wtf('intro text.\n* one\n* two\n').html())
  t.ok(html.indexOf('intro text.') < html.indexOf('<ul'), 'list stays after the intro')
  t.end()
})

test('html: parenthesized link', (t) => {
  has(
    t,
    wtf('see [[Mercury (planet)]] now').html(),
    '<a class="link" href="./Mercury_(planet)">Mercury (planet)</a>',
    'title with parentheses is linked'
  )
  t.end()
})
