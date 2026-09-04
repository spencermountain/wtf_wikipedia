import test from 'tape'
import wtf from '../lib/index.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))

//title
test('Tile - get - first sentence', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(doc.title(), 'Charles Frank Milstead', 'the title equals the fist bolded text')
  t.end()
})

test('Tile - get - no bold in sentence ', (t) => {
  let str = 'no bold in first sentence'
  let doc = wtf(str)
  t.equal(doc.title(), null, 'the title equals null')
  t.end()
})

test('Tile - get - return null if there are no sentences', (t) => {
  let str = ''
  let doc = wtf(str)
  t.equal(doc.title(), null, 'the title equals null')
  t.end()
})

test('Tile - get / set - if the title is already set than get it from internal object', (t) => {
  let str = 'no bold in first sentence'
  let doc = wtf(str)
  doc.title('some title')
  t.equal(doc.title(), 'some title', 'the title equals the set title')
  t.end()
})

//pageID
test('pageID - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.pageID(), null, 'the pageID equals null')
  t.end()
})

test('pageID - get - if the pageID is already set than get it from internal object', (t) => {
  let doc = wtf('', { pageID: 1 })
  t.equal(doc.pageID(), 1, 'the pageID equals 1')
  t.end()
})

test('pageID - get / set - if the pageID is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.pageID(1)
  t.equal(doc.pageID(), 1, 'the pageID equals 1')
  t.end()
})

//revisionID
test('revisionID - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.revisionID(), null, 'the revisionID equals null')
  t.end()
})

test('revisionID - get - if the revisionID is already set than get it from internal object', (t) => {
  let doc = wtf('', { revisionID: 1 })
  t.equal(doc.revisionID(), 1, 'the revisionID equals 1')
  t.end()
})

test('revisionID - get / set - if the revisionID is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.revisionID(1)
  t.equal(doc.revisionID(), 1, 'the revisionID equals 1')
  t.end()
})

//wikidata
test('wikidata - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.wikidata(), null, 'the wikidata equals null')
  t.end()
})

test('wikidata - get - if the wikidata is already set than get it from internal object', (t) => {
  let doc = wtf('', { wikidata: 'Q42' })
  t.equal(doc.wikidata(), 'Q42', "the wikidata equals 'Q42'")
  t.end()
})

test('wikidata - get / set - if the wikidata is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.wikidata('Q42')
  t.equal(doc.wikidata(), 'Q42', "the wikidata equals 'Q42'")
  t.end()
})

//domain
test('domain - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.domain(), null, 'the null equals undefined')
  t.end()
})

test('domain - get - if the domain is already set than get it from internal object', (t) => {
  let doc = wtf('', { domain: 'wikidata.org' })
  t.equal(doc.domain(), 'wikidata.org', "the domain equals 'wikidata.org'")
  t.end()
})

test('domain - get / set - if the domain is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.domain('wikidata.org')
  t.equal(doc.domain(), 'wikidata.org', "the domain equals 'wikidata.org'")
  t.end()
})

//language  - Same test as lang
test('language - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.language(), null, 'the language equals null')
  t.end()
})

test('language - get - if the language is already set than get it from internal object', (t) => {
  let doc = wtf('', { language: 'nl' })
  t.equal(doc.language(), 'nl', "the language equals 'nl'")
  t.end()
})

test('language - get / set - if the language is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.language('nl')
  t.equal(doc.language(), 'nl', "the language equals 'nl'")
  t.end()
})

//lang - Same test as language
test('lang - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.lang(), null, 'the lang equals null')
  t.end()
})

test('lang - get - if the lang is already set than get it from internal object', (t) => {
  let doc = wtf('', { language: 'nl' })
  t.equal(doc.lang(), 'nl', "the lang equals 'nl'")
  t.end()
})

test('lang - get / set - if the lang is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.lang('nl')
  t.equal(doc.lang(), 'nl', "the lang equals 'nl'")
  t.end()
})

//url
test('url - get - if there is no title return null', (t) => {
  let doc = wtf('')
  t.equal(doc.url(), null, 'the url equals null')
  t.end()
})

test('url - get - if lang and domain are undefined then default to en.wikipedia.org', (t) => {
  let doc = wtf('', { title: 'Barack Obama' })
  t.equal(doc.url(), 'https://en.wikipedia.org/wiki/Barack_Obama', 'the url equals the right page')
  t.end()
})

test('url - get - if lang and domain are set then use them', (t) => {
  let doc = wtf('', { title: 'Barack Obama', language: 'military', domain: 'wikia.org' })
  t.equal(doc.url(), 'https://military.wikia.org/wiki/Barack_Obama', 'the url equals the right page')
  t.end()
})

//namespace  - same test as ns
test('namespace - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.namespace(), null, 'the namespace equals null')
  t.end()
})

test('namespace - get - if the namespace is already set than get it from internal object', (t) => {
  let doc = wtf('', { ns: 'talk' })
  t.equal(doc.namespace(), 'talk', "the namespace equals 'talk'")
  t.end()
})

test('namespace - get - if the namespace is already set the other way than get it from internal object', (t) => {
  let doc = wtf('', { namespace: 'talk' })
  t.equal(doc.namespace(), 'talk', "the namespace equals 'talk'")
  t.end()
})

test('namespace - get / set - if the namespace is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.namespace('talk')
  t.equal(doc.namespace(), 'talk', "the namespace equals 'talk'")
  t.end()
})

//ns - same test as namespace
test('ns - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.ns(), null, 'the ns equals null')
  t.end()
})

test('ns - get - if the ns is already set than get it from internal object', (t) => {
  let doc = wtf('', { ns: 'talk' })
  t.equal(doc.ns(), 'talk', "the ns equals 'talk'")
  t.end()
})

test('ns - get - if the ns is already set the other way than get it from internal object', (t) => {
  let doc = wtf('', { ns: 'talk' })
  t.equal(doc.ns(), 'talk', "the ns equals 'talk'")
  t.end()
})

test('ns - get / set - if the ns is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.ns('talk')
  t.equal(doc.ns(), 'talk', "the ns equals 'talk'")
  t.end()
})

//isRedirect
test('isRedirect - get - should initially be false', (t) => {
  let doc = wtf('')
  t.equal(doc.isRedirect(), false, 'the isRedirect equals false')
  t.end()
})

test('isRedirect - get - if the type of page is should default to page and return false', (t) => {
  let doc = wtf('', { type: 'redirect' })
  t.equal(doc.isRedirect(), false, 'the empty-string isRedirect equals false')
  t.end()
})

test('isRedirect - get - if the page is a redirect than return true', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.equal(doc.isRedirect(), true, 'the DOORVERWIJZING isRedirect equals true')
  t.end()
})

//redirectTo -- same as redirectsTo & redirect & redirects
test('redirectTo - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.redirectTo(), null, 'the redirectTo equals null')
  t.end()
})

test('redirectTo - get - if the page is a redirect than return the target page', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirectTo(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirectTo equals 'Doelpagina'")
  t.end()
})

//redirectsTo -- same as redirectTo
test('redirectsTo - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.redirectsTo(), null, 'the redirectsTo equals null')
  t.end()
})

test('redirectsTo - get - if the page is a redirect than return the target page', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirectsTo(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirectsTo equals 'Doelpagina'")
  t.end()
})

//redirect -- same as redirectTo
test('redirect - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.redirect(), null, 'the redirect equals null')
  t.end()
})

test('redirect - get - if the page is a redirect than return the target page', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirect(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirect equals 'Doelpagina'")
  t.end()
})

//redirects -- same as redirectTo
test('redirects - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.redirects(), null, 'the redirects equals null')
  t.end()
})

test('redirects - get - if the page is a redirect than return the target page', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirects(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirects equals 'Doelpagina'")
  t.end()
})

//isDisambiguation -- same as isDisambig
test('isDisambiguation - get - if the page is not a Disambiguation page than return false', (t) => {
  let doc = wtf('not disambiguation')
  t.equal(doc.isDisambiguation(), false, 'the isDisambiguation equals false')
  t.end()
})

test('isDisambiguation - get - if the page is a Disambiguation page than return true', (t) => {
  let doc = wtf('{{dp}}')
  t.equal(doc.isDisambiguation(), true, 'the isDisambiguation equals true')
  t.end()
})

//isDisambig -- same as isDisambiguation
test('isDisambig - get - if the page is not a Disambiguation page than return false', (t) => {
  let doc = wtf('not disambiguation')
  t.equal(doc.isDisambig(), false, 'the isDisambig equals false')
  t.end()
})

test('isDisambig - get - if the page is a Disambiguation page than return true', (t) => {
  let doc = wtf('{{dp}}')
  t.equal(doc.isDisambig(), true, 'the isDisambig equals true')
  t.end()
})

//categories
test('categories - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.categories(), [], 'the categories equals []')
  t.end()
})

test('categories - get - if the categories is in the option. ignore it', (t) => {
  let doc = wtf('', { categories: ['Q42'] })
  t.deepEqual(doc.categories(), [], 'the categories equals []')
  t.end()
})

test('categories - get - if the clue is a undefined / unset return the list of categories', (t) => {
  let doc = wtf(`
    [[Category:WWE Hall of Fame inductees]]
    [[Category:Writers from New York City]]
    [[Category:American people of German descent]]
    [[Category:American people of Scottish descent]]
  `)
  const expected = [
    'WWE Hall of Fame inductees',
    'Writers from New York City',
    'American people of German descent',
    'American people of Scottish descent',
  ]
  t.deepEqual(doc.categories(), expected, 'the categories in the wiki text')
  t.end()
})

test('categories - get - if the clue is a number return the category in that index', (t) => {
  let doc = wtf(`
    [[Category:WWE Hall of Fame inductees]]
    [[Category:Writers from New York City]]
    [[Category:American people of German descent]]
    [[Category:American people of Scottish descent]]
  `)
  t.equal(doc.category(1), 'Writers from New York City', 'the categories at index 1')
  t.end()
})

test('categories - get - if the clue is not a number return the list of categories', (t) => {
  let doc = wtf(`
    [[Category:WWE Hall of Fame inductees]]
    [[Category:Writers from New York City]]
    [[Category:American people of German descent]]
    [[Category:American people of Scottish descent]]
  `)
  const expected = [
    'WWE Hall of Fame inductees',
    'Writers from New York City',
    'American people of German descent',
    'American people of Scottish descent',
  ]
  t.deepEqual(doc.categories('string'), expected, 'the categories in the wiki text')
  t.end()
})

//sections
test('sections - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.sections(), [], 'the sections equals []')
  t.end()
})

test('sections - get - if the sections is in the option. ignore it', (t) => {
  let doc = wtf('', { sections: ['Q42'] })
  t.deepEqual(doc.sections(), [], 'the sections equals []')
  t.end()
})

// one small page exercises every content accessor - real values, no cached pages
const PAGE = `'''Testville''' is a small test page. It has two sentences.
{{Infobox person
| name = Jane Doe
| age = 44
}}
{{coord|43.65|-79.38|display=title}}

==History==
The [[Rome|city]] was founded in 1904. It grew [[quickly]].

A second paragraph, with a [[Fun|link]] here.

===Early days===
* one fish
* two fish
[[File:Crest.jpg|thumb|the crest]]
Nested text here.<ref>{{cite web|url=http://example.com|title=Some Ref}}</ref>

{| class="wikitable"
! name !! age
|-
| jane || 40
|}

==Career==
Career text goes here. See [[fr:Ville]] too.
<gallery>
File:Second.jpg|second image
</gallery>

==See also==
* [[Other page]]
`
const page = wtf(PAGE)

test('sections - get - if the clue is a undefined / unset return the list of sections', (t) => {
  t.deepEqual(
    page.sections().map((s) => s.title()),
    ['', 'History', 'Early days', 'Career', 'See also']
  )
  t.end()
})

test('sections - get - if the clue is a number return the section at that index', (t) => {
  t.equal(page.section(1).title(), 'History', 'the section at index 1')
  t.end()
})

test('sections - get - if the clue is a string return the section of that title', (t) => {
  t.equal(page.section('History').sentence().text(), 'The city was founded in 1904.')
  t.end()
})

test('sections - get - string clue is case-insensitive', (t) => {
  t.equal(page.section('HISTORY').title(), 'History')
  t.end()
})

//paragraphs
test('paragraphs - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.paragraphs(), [], 'the paragraphs equals []')
  t.end()
})

test('paragraphs - get - if the paragraphs is in the option. ignore it', (t) => {
  let doc = wtf('', { paragraphs: ['Q42'] })
  t.deepEqual(doc.paragraphs(), [], 'the paragraphs equals []')
  t.end()
})

test('paragraphs - get - if the clue is a undefined / unset return the list of paragraphs', (t) => {
  t.deepEqual(
    page.paragraphs().map((p) => p.text()),
    [
      'Testville is a small test page. It has two sentences.',
      'The city was founded in 1904. It grew quickly.',
      'A second paragraph, with a link here.',
      'Nested text here.\n * one fish\n * two fish',
      'Career text goes here. See Ville too.',
      '\n * Other page',
    ]
  )
  t.end()
})

test('paragraph - get - if the clue is a number return the paragraph at that index', (t) => {
  t.equal(page.paragraph(1).text(), 'The city was founded in 1904. It grew quickly.')
  t.end()
})

test('paragraph - get - if the clue is unset or undefined return the first paragraph', (t) => {
  t.equal(page.paragraph().text(), 'Testville is a small test page. It has two sentences.')
  t.end()
})

test('paragraph - get - if the clue is not a number return the first paragraph', (t) => {
  t.equal(page.paragraph('string').text(), 'Testville is a small test page. It has two sentences.')
  t.end()
})

//sentences
test('sentences - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.sentences(), [], 'the sentences equals []')
  t.end()
})

test('sentences - get - if the sentences is in the option. ignore it', (t) => {
  let doc = wtf('', { sentences: ['Q42'] })
  t.deepEqual(doc.sentences(), [], 'the sentences equals []')
  t.end()
})

test('sentences - get - if the clue is a undefined / unset return the list of sentences', (t) => {
  t.deepEqual(
    page.sentences().map((s) => s.text()),
    [
      'Testville is a small test page.',
      'It has two sentences.',
      'The city was founded in 1904.',
      'It grew quickly.',
      'A second paragraph, with a link here.',
      'Nested text here.',
      'Career text goes here.',
      'See Ville too.',
    ]
  )
  t.end()
})

test('sentences - get - if the clue is a number return the sentence at that index', (t) => {
  t.equal(page.sentence(1).text(), 'It has two sentences.')
  t.end()
})

test('sentences - get - if the clue is a string (not number) return all the sentences', (t) => {
  t.equal(page.sentences('string').length, page.sentences().length, 'string clue returns all')
  t.end()
})

test('sentence - get - should return the first sentence', (t) => {
  t.equal(page.sentence().text(), 'Testville is a small test page.')
  t.end()
})

//images
test('images - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.images(), [], 'the images equals []')
  t.end()
})

test('images - get - if the images is in the option. ignore it', (t) => {
  let doc = wtf('', { images: ['Q42'] })
  t.deepEqual(doc.images(), [], 'the images equals []')
  t.end()
})

test('images - get - finds inline, and gallery images', (t) => {
  t.deepEqual(
    page.images().map((i) => i.file()),
    ['File:Crest.jpg', 'File:Second.jpg']
  )
  t.end()
})

test('images - get - if the clue is a number return the image at that index', (t) => {
  t.equal(page.image(1).file(), 'File:Second.jpg')
  t.end()
})

test('image - get - return the first image on the page', (t) => {
  t.equal(page.image().file(), 'File:Crest.jpg')
  t.equal(page.image().url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Crest.jpg')
  t.end()
})

//links
test('links - get - return all links on the page', (t) => {
  t.deepEqual(
    page.links().map((l) => l.page()),
    ['Rome', 'quickly', 'Fun', 'Ville', 'Other page']
  )
  t.end()
})

test('links - get - if the clue is a number return the link at that index', (t) => {
  t.equal(page.link(1).page(), 'quickly')
  t.end()
})

test('links - get - if the clue is a string return the link with that page', (t) => {
  t.deepEqual(page.links('fun').map((l) => l.page()), ['Fun'], 'case-insensitive match')
  t.end()
})

test('links - get - if the clue is any other type then return all links', (t) => {
  t.equal(page.links([]).length, page.links().length)
  t.end()
})

//interwiki
test('interwiki - get - return only the interwiki links', (t) => {
  t.deepEqual(page.interwiki().map((l) => l.json()), [{ type: 'interwiki', wiki: 'fr', page: 'Ville' }])
  t.end()
})

//lists
test('lists - get - return all lists on the page', (t) => {
  t.deepEqual(
    page.lists().map((l) => l.lines().map((s) => s.text())),
    [
      ['one fish', 'two fish'],
      ['Other page'],
    ]
  )
  t.end()
})

test('lists - get - if the clue is a number return the list at that index', (t) => {
  t.deepEqual(page.list(1).lines().map((s) => s.text()), ['Other page'])
  t.end()
})

//tables
test('tables - get - return all tables', (t) => {
  t.deepEqual(page.tables().map((tb) => tb.keyValue()), [[{ name: 'jane', age: '40' }]])
  t.end()
})

test('tables - get - if the clue is a number return the table at that index', (t) => {
  t.deepEqual(page.table(0).keyValue(), [{ name: 'jane', age: '40' }])
  t.end()
})

//templates
test('templates - get - return all templates', (t) => {
  t.deepEqual(
    page.templates().map((te) => te.json().template),
    ['coord', 'gallery']
  )
  t.end()
})

test('templates - get - if the clue is a number return the template at that index', (t) => {
  t.deepEqual(page.template(0).json(), { display: 'title', template: 'coord', lat: 43.65, lon: -79.38 })
  t.end()
})

test('templates - get - if the clue is a string return templates of that name', (t) => {
  t.equal(page.templates('coord').length, 1)
  t.end()
})

//references -- same as citations
test('references - get - return all references', (t) => {
  t.deepEqual(page.references().map((r) => r.title()), ['Some Ref'])
  t.end()
})

test('references - get - if the clue is a number return the reference at that index', (t) => {
  t.equal(page.reference(0).title(), 'Some Ref')
  t.end()
})

test('citations - get - is an alias of references', (t) => {
  t.deepEqual(page.citations().map((r) => r.title()), ['Some Ref'])
  t.equal(page.citation().title(), 'Some Ref')
  t.end()
})

//coordinates
test('coordinates - get - return all coordinates', (t) => {
  t.deepEqual(page.coordinates(), [{ display: 'title', template: 'coord', lat: 43.65, lon: -79.38 }])
  t.end()
})

test('coordinates - get - if the clue is a number return the coordinate at that index', (t) => {
  t.equal(page.coordinate(0).lat, 43.65)
  t.end()
})

//infoboxes
test('infoboxes - get - return all infoboxes', (t) => {
  t.deepEqual(page.infoboxes().map((i) => i.type()), ['person'])
  t.end()
})

test('infoboxes - get - field access', (t) => {
  t.equal(page.infobox().get('name').text(), 'Jane Doe')
  t.deepEqual(page.infobox().keyValue(), { name: 'Jane Doe', age: '44' })
  t.end()
})

//text
test('text - get - get the text version of the document', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Remote-Data-Services.txt'), 'utf-8')
  let doc = wtf(str)
  const expected =
    'Remote Data Services (RDS, formerly known as Advanced Data Connector or ADC) is a Microsoft technology used in conjunction with ActiveX Data Objects (ADO) that allowed the retrieval of a set of data from a database server, which the client then altered in some way and then sent back to the server for further processing. With the popular adoption of Transact-SQL, which extends SQL with such programming constructs as loops and conditional statements, this became less necessary and it was eventually deprecated in Microsoft Data Access Components version 2.7. Microsoft produced SOAP Toolkit 2.0, which allows clients to do this via an open XML-based standard.\n\n\n * MSDN Remote Data Service (RDS) description'
  t.deepEqual(doc.text(), expected, 'Text version of the document')
  t.end()
})

test('text - get - enpty string for redirects', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  const expected = ''
  t.deepEqual(doc.text(), expected, 'empty string')
  t.end()
})

//plaintext -- same as text
test('plaintext - get - get the plaintext version of the document', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Remote-Data-Services.txt'), 'utf-8')
  let doc = wtf(str)
  const expected =
    'Remote Data Services (RDS, formerly known as Advanced Data Connector or ADC) is a Microsoft technology used in conjunction with ActiveX Data Objects (ADO) that allowed the retrieval of a set of data from a database server, which the client then altered in some way and then sent back to the server for further processing. With the popular adoption of Transact-SQL, which extends SQL with such programming constructs as loops and conditional statements, this became less necessary and it was eventually deprecated in Microsoft Data Access Components version 2.7. Microsoft produced SOAP Toolkit 2.0, which allows clients to do this via an open XML-based standard.\n\n\n * MSDN Remote Data Service (RDS) description'
  t.deepEqual(doc.plaintext(), expected, 'Text version of the document')
  t.end()
})

test('plaintext - get - enpty string for redirects', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  const expected = ''
  t.deepEqual(doc.plaintext(), expected, 'empty string')
  t.end()
})

//debug
//we need something like sinon for mocking the console.log

//singular-methods
test('plurals / singular - all should exist', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  let singels = [
    'section',
    'infobox',
    'sentence',
    'citation',
    'reference',
    'coordinate',
    'table',
    'list',
    'link',
    'image',
    'template',
    'category',
  ]
  singels.forEach((s) => {
    t.equal(typeof doc[s], 'function', 'every function needs to be defined. also ' + s)
  })
  t.end()
})
