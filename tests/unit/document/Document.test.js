import { readPage } from '../../_examples/index.js'
import test from 'tape'
import wtf from '../../lib/index.js'

//title
test('Tile - get - first sentence', (t) => {
  const str = readPage('Charlie-Milstead')
  const doc = wtf(str)
  t.equal(doc.title, 'Charles Frank Milstead', 'the title equals the fist bolded text')
  t.end()
})

test('Tile - get - no bold in sentence ', (t) => {
  const str = 'no bold in first sentence'
  const doc = wtf(str)
  t.equal(doc.title, null, 'the title equals null')
  t.end()
})

test('Tile - get - return null if there are no sentences', (t) => {
  const str = ''
  const doc = wtf(str)
  t.equal(doc.title, null, 'the title equals null')
  t.end()
})

test('Tile - get / set - if the title is already set than get it from internal object', (t) => {
  const str = 'no bold in first sentence'
  const doc = wtf(str)
  doc.title = 'some title'
  t.equal(doc.title, 'some title', 'the title equals the set title')
  t.end()
})

//pageID
test('pageID - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.pageID, null, 'the pageID equals null')
  t.end()
})

test('pageID - get - if the pageID is already set than get it from internal object', (t) => {
  const doc = wtf('', { pageId: 1 })
  t.equal(doc.pageID, 1, 'the pageID equals 1')
  t.end()
})

test('pageID - get / set - if the pageID is set then it should return the same ', (t) => {
  const doc = wtf('')
  doc.pageID = 2
  t.equal(doc.pageID, 2, 'the pageID equals 2')
  t.end()
})

//revisionID
test('revisionID - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.revisionID, null, 'the revisionID equals null')
  t.end()
})

test('revisionID - get - if the revisionID is already set than get it from internal object', (t) => {
  const doc = wtf('', { revisionId: 1 })
  t.equal(doc.revisionID, 1, 'the revisionID equals 1')
  t.end()
})

test('revisionID - get / set - if the revisionID is set then it should return the same ', (t) => {
  const doc = wtf('')
  doc.revisionID = 1
  t.equal(doc.revisionID, 1, 'the revisionID equals 1')
  t.end()
})

//wikidata
test('wikidata - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.wikidata, null, 'the wikidata equals null')
  t.end()
})

test('wikidata - get - if the wikidata is already set than get it from internal object', (t) => {
  const doc = wtf('', { wikidata: 'Q42' })
  t.equal(doc.wikidata, 'Q42', "the wikidata equals 'Q42'")
  t.end()
})

test('wikidata - get / set - if the wikidata is set then it should return the same ', (t) => {
  const doc = wtf('')
  doc.wikidata = 'Q42'
  t.equal(doc.wikidata, 'Q42', "the wikidata equals 'Q42'")
  t.end()
})

//domain
test('domain - get - defaults to wikipedia.org', (t) => {
  const doc = wtf('')
  t.equal(doc.domain, 'wikipedia.org', 'default domain')
  t.end()
})

test('domain - get - if the domain is already set than get it from internal object', (t) => {
  const doc = wtf('', { domain: 'wikidata.org' })
  t.equal(doc.domain, 'wikidata.org', "the domain equals 'wikidata.org'")
  t.end()
})

test('domain - get / set - if the domain is set then it should return the same ', (t) => {
  const doc = wtf('')
  doc.domain = 'wikidata.org'
  t.equal(doc.domain, 'wikidata.org', "the domain equals 'wikidata.org'")
  t.end()
})

//language
test('language - get - defaults to en', (t) => {
  const doc = wtf('')
  t.equal(doc.language, 'en', 'default language')
  t.end()
})

test('language - get - if the language is already set than get it from internal object', (t) => {
  const doc = wtf('', { lang: 'nl' })
  t.equal(doc.language, 'nl', "the language equals 'nl'")
  t.end()
})

test('language - get / set - if the language is set then it should return the same ', (t) => {
  const doc = wtf('')
  doc.language = 'nl'
  t.equal(doc.language, 'nl', "the language equals 'nl'")
  t.end()
})

//url
test('url - get - if there is no title return null', (t) => {
  const doc = wtf('')
  t.equal(doc.url(), null, 'the url equals null')
  t.end()
})

test('url - get - if lang and domain are undefined then default to en.wikipedia.org', (t) => {
  const doc = wtf('', { title: 'Barack Obama' })
  t.equal(doc.url(), 'https://en.wikipedia.org/wiki/Barack_Obama', 'the url equals the right page')
  t.end()
})

test('url - get - if lang and domain are set then use them', (t) => {
  const doc = wtf('', { title: 'Barack Obama', lang: 'military', domain: 'wikia.org' })
  t.equal(doc.url(), 'https://military.wikia.org/wiki/Barack_Obama', 'the url equals the right page')
  t.end()
})

//namespace
test('namespace - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.namespace, null, 'the namespace equals null')
  t.end()
})

test('namespace - get - if the namespace is already set than get it from internal object', (t) => {
  const doc = wtf('', { namespace: 'talk' })
  t.equal(doc.namespace, 'talk', "the namespace equals 'talk'")
  t.end()
})

test('namespace - get / set - if the namespace is set then it should return the same ', (t) => {
  const doc = wtf('')
  doc.namespace = 'talk'
  t.equal(doc.namespace, 'talk', "the namespace equals 'talk'")
  t.end()
})

//isRedirect
test('isRedirect - get - should initially be false', (t) => {
  const doc = wtf('')
  t.equal(doc.isRedirect(), false, 'the isRedirect equals false')
  t.end()
})

test('isRedirect - get - if the type of page is should default to page and return false', (t) => {
  const doc = wtf('', { type: 'redirect' })
  t.equal(doc.isRedirect(), false, 'the empty-string isRedirect equals false')
  t.end()
})

test('isRedirect - get - if the page is a redirect than return true', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.equal(doc.isRedirect(), true, 'the DOORVERWIJZING isRedirect equals true')
  t.end()
})

//redirectTo -- same as redirectsTo & redirect & redirects
test('redirectTo - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.redirectTo(), null, 'the redirectTo equals null')
  t.end()
})

test('redirectTo - get - if the page is a redirect than return the target page', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirectTo(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirectTo equals 'Doelpagina'")
  t.end()
})

//redirectsTo -- same as redirectTo
test('redirectsTo - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.redirectsTo(), null, 'the redirectsTo equals null')
  t.end()
})

test('redirectsTo - get - if the page is a redirect than return the target page', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirectsTo(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirectsTo equals 'Doelpagina'")
  t.end()
})

//redirect -- same as redirectTo
test('redirect - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.redirect(), null, 'the redirect equals null')
  t.end()
})

test('redirect - get - if the page is a redirect than return the target page', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirect(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirect equals 'Doelpagina'")
  t.end()
})

//redirects -- same as redirectTo
test('redirects - get - should initially be null', (t) => {
  const doc = wtf('')
  t.equal(doc.redirectsTo(), null, 'the redirects equals null')
  t.end()
})

test('redirects - get - if the page is a redirect than return the target page', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.deepEqual(doc.redirectsTo(), { page: 'Doelpagina', raw: '[[Doelpagina]]' }, "the redirects equals 'Doelpagina'")
  t.end()
})

//isDisambiguation -- same as isDisambig
test('isDisambiguation - get - if the page is not a Disambiguation page than return false', (t) => {
  const doc = wtf('not disambiguation')
  t.equal(doc.isDisambiguation(), false, 'the isDisambiguation equals false')
  t.end()
})

test('isDisambiguation - get - if the page is a Disambiguation page than return true', (t) => {
  const doc = wtf('{{dp}}')
  t.equal(doc.isDisambiguation(), true, 'the isDisambiguation equals true')
  t.end()
})

//isDisambig -- same as isDisambiguation
test('isDisambig - get - if the page is not a Disambiguation page than return false', (t) => {
  const doc = wtf('not disambiguation')
  t.equal(doc.isDisambig(), false, 'the isDisambig equals false')
  t.end()
})

test('isDisambig - get - if the page is a Disambiguation page than return true', (t) => {
  const doc = wtf('{{dp}}')
  t.equal(doc.isDisambig(), true, 'the isDisambig equals true')
  t.end()
})

//categories
test('categories - get - should initially be []', (t) => {
  const doc = wtf('')
  t.deepEqual(doc.categories(), [], 'the categories equals []')
  t.end()
})

test('categories - get - if the categories is in the option. ignore it', (t) => {
  const doc = wtf('', { categories: ['Q42'] })
  t.deepEqual(doc.categories(), [], 'the categories equals []')
  t.end()
})

test('categories - get - if the clue is a undefined / unset return the list of categories', (t) => {
  const doc = wtf(`
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
  const doc = wtf(`
    [[Category:WWE Hall of Fame inductees]]
    [[Category:Writers from New York City]]
    [[Category:American people of German descent]]
    [[Category:American people of Scottish descent]]
  `)
  t.equal(doc.categories()[1], 'Writers from New York City', 'the categories at index 1')
  t.end()
})

test('categories - get - if the clue is not a number return the list of categories', (t) => {
  const doc = wtf(`
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
// test('sections - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.sections().isEmpty(), 'the sections collection is empty')
//   t.end()
// })
//
// test('sections - get - if the sections is in the option. ignore it', (t) => {
//   const doc = wtf('', { sections: ['Q42'] })
//   t.ok(doc.sections().isEmpty(), 'the sections collection is empty')
//   t.end()
// })

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
    ['', 'History', 'Early days', 'Career', 'See also'],
    'section titles'
  )
  t.end()
})

test('sections - get - if the clue is a number return the section at that index', (t) => {
  t.equal(page.section(1).title(), 'History', 'the section at index 1')
  t.end()
})

test('sections - get - if the clue is a string return the section of that title', (t) => {
  t.equal(page.section('History').sentence().text(), 'The city was founded in 1904.', 'section lookup sentence')
  t.end()
})

test('sections - get - string clue is case-insensitive', (t) => {
  t.equal(page.section('HISTORY').title(), 'History', 'case-insensitive title')
  t.end()
})

//paragraphs
// test('paragraphs - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.paragraphs().isEmpty(), 'the paragraphs collection is empty')
//   t.end()
// })

// test('paragraphs - get - if the paragraphs is in the option. ignore it', (t) => {
//   const doc = wtf('', { paragraphs: ['Q42'] })
//   t.ok(doc.paragraphs().isEmpty(), 'the paragraphs collection is empty')
//   t.end()
// })

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
    ],
    'paragraph texts'
  )
  t.end()
})

test('paragraph - get - if the clue is a number return the paragraph at that index', (t) => {
  t.equal(page.paragraphs()[1].text(), 'The city was founded in 1904. It grew quickly.', 'indexed paragraph text')
  t.end()
})

test('paragraph - get - if the clue is unset or undefined return the first paragraph', (t) => {
  t.equal(page.paragraphs()[0].text(), 'Testville is a small test page. It has two sentences.', 'first paragraph text')
  t.end()
})
//
// test('paragraph - get - unsupported selector returns null', (t) => {
//   t.equal(page.paragraphs()['string'], undefined, 'unsupported paragraph selector')
//   t.end()
// })

//sentences
// test('sentences - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.sentences().isEmpty(), 'the sentences collection is empty')
//   t.end()
// })
//
// test('sentences - get - if the sentences is in the option. ignore it', (t) => {
//   const doc = wtf('', { sentences: ['Q42'] })
//   t.ok(doc.sentences().isEmpty(), 'the sentences collection is empty')
//   t.end()
// })

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
    ],
    'sentence texts'
  )
  t.end()
})

// test('sentences - get - if the clue is a number return the sentence at that index', (t) => {
//   t.equal(page.sentence(1).text(), 'It has two sentences.', 'indexed sentence text')
//   t.end()
// })
//
// test('sentences - get - unsupported string selector returns an empty collection', (t) => {
//   t.ok(page.sentences('string').isEmpty(), 'unsupported string selector returns no sentences')
//   t.end()
// })

test('sentence - get - should return the first sentence', (t) => {
  t.equal(page.sentence().text(), 'Testville is a small test page.', 'first sentence text')
  t.end()
})

//images
// test('images - get - should initially be an empty collection', (t) => {
//   const doc = wtf('')
//   t.ok(doc.images().isEmpty(), 'the images collection is empty')
//   t.end()
// })
//
// test('images - get - if the images is in the option. ignore it', (t) => {
//   const doc = wtf('', { images: ['Q42'] })
//   t.ok(doc.images().isEmpty(), 'the images collection is empty')
//   t.end()
// })

test('images - get - finds inline, and gallery images', (t) => {
  t.deepEqual(
    page.images().map((i) => i.file()),
    ['File:Crest.jpg', 'File:Second.jpg'],
    'image filenames'
  )
  t.end()
})

// test('images - get - if the clue is a number return the image at that index', (t) => {
//   t.equal(page.images()[1].file(), 'File:Second.jpg', 'indexed image filename')
//   t.end()
// })

test('image - get - return the first image on the page', (t) => {
  t.equal(page.images()[0].file(), 'File:Crest.jpg', 'first image filename')
  t.equal(page.images()?.[0].url(), 'https://wikipedia.org/wiki/Special:Redirect/file/Crest.jpg', 'first image URL')
  t.end()
})

//links
test('links - get - return all links on the page', (t) => {
  t.deepEqual(
    page.links().map((l) => l.page()),
    ['Rome', 'quickly', 'Fun', 'Ville', 'Other page'],
    'link targets'
  )
  t.end()
})

test('links - get - if the clue is a number return the link at that index', (t) => {
  t.equal(page.links()[1].page(), 'quickly', 'indexed link target')
  t.end()
})

test('links - get - if the clue is a string return the link with that page', (t) => {
  t.deepEqual(
    page.links('fun').map((l) => l.page()),
    ['Fun'],
    'case-insensitive match'
  )
  t.end()
})

// test('links - get - unsupported selector returns an empty collection', (t) => {
//   t.ok(page.links([]).isEmpty(), 'unsupported selector returns no links')
//   t.end()
// })

//interwiki
test('interwiki - get - return only the interwiki links', (t) => {
  t.deepEqual(
    page.interwiki().map((l) => l.json()),
    [{ type: 'interwiki', wiki: 'fr', page: 'Ville' }],
    'interwiki JSON'
  )
  t.end()
})

//lists
test('lists - get - return all lists on the page', (t) => {
  t.deepEqual(
    page.lists().map((l) => l.lines().map((s) => s.text)),
    [['one fish', 'two fish'], ['Other page']],
    'list lines'
  )
  t.end()
})

test('lists - get - if the clue is a number return the list at that index', (t) => {
  t.deepEqual(
    page
      .lists()[1]
      .lines()
      .map((s) => s.text),
    ['Other page'],
    'indexed list lines'
  )
  t.end()
})

//tables
test('tables - get - return all tables', (t) => {
  t.deepEqual(
    page.tables().map((tb) => tb.rows()),
    [[{ name: 'jane', age: '40' }]],
    'table values'
  )
  t.end()
})

test('tables - get - if the clue is a number return the table at that index', (t) => {
  t.deepEqual(page.tables()[0].rows(), [{ name: 'jane', age: '40' }], 'indexed table values')
  t.end()
})

//templates
test('templates - get - return all templates', (t) => {
  t.deepEqual(
    page.templates().map((te) => te.json().template),
    ['coord', 'gallery'],
    'template names'
  )
  t.end()
})

test('templates - get - if the clue is a number return the template at that index', (t) => {
  t.deepEqual(
    page.template(0).json(),
    { display: 'title', template: 'coord', lat: 43.65, lon: -79.38 },
    'indexed template JSON'
  )
  t.end()
})

test('templates - get - if the clue is a string return templates of that name', (t) => {
  t.equal(page.templates('coord').length, 1, 'named template count')
  t.end()
})

//references -- same as citations
test('references - get - return all references', (t) => {
  t.deepEqual(
    page.references().map((r) => r.title()),
    ['Some Ref'],
    'reference titles'
  )
  t.end()
})

test('references - get - if the clue is a number return the reference at that index', (t) => {
  t.equal(page.references()[0].title(), 'Some Ref', 'indexed reference title')
  t.end()
})

test('citations - get - is an alias of references', (t) => {
  t.deepEqual(
    page.citations().map((r) => r.title()),
    ['Some Ref'],
    'citation titles'
  )
  t.equal(page.citations()[0].title(), 'Some Ref', 'first citation title')
  t.end()
})

//coordinates
test('coordinates - get - return all coordinates', (t) => {
  t.deepEqual(page.coordinates(), [{ display: 'title', template: 'coord', lat: 43.65, lon: -79.38 }], 'coordinates')
  t.end()
})

test('coordinates - get - if the clue is a number return the coordinate at that index', (t) => {
  t.equal(page.coordinates()[0].lat, 43.65, 'indexed latitude')
  t.end()
})

//infoboxes
test('infoboxes - get - return all infoboxes', (t) => {
  t.deepEqual(
    page.infoboxes().map((i) => i.type()),
    ['person'],
    'infobox types'
  )
  t.end()
})

test('infoboxes - get - field access', (t) => {
  t.equal(page.infobox().get('name').text(), 'Jane Doe', 'infobox name')
  t.deepEqual(page.infobox().keyValue(), { name: 'Jane Doe', age: '44' }, 'infobox values')
  t.end()
})

//text
test('text - get - get the text version of the document', (t) => {
  const str = readPage('Remote-Data-Services')
  const doc = wtf(str)
  const expected =
    'Remote Data Services (RDS, formerly known as Advanced Data Connector or ADC) is a Microsoft technology used in conjunction with ActiveX Data Objects (ADO) that allowed the retrieval of a set of data from a database server, which the client then altered in some way and then sent back to the server for further processing. With the popular adoption of Transact-SQL, which extends SQL with such programming constructs as loops and conditional statements, this became less necessary and it was eventually deprecated in Microsoft Data Access Components version 2.7. Microsoft produced SOAP Toolkit 2.0, which allows clients to do this via an open XML-based standard.\n\n\n * MSDN Remote Data Service (RDS) description'
  t.deepEqual(doc.text(), expected, 'Text version of the document')
  t.end()
})

test('text - get - enpty string for redirects', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  const expected = ''
  t.deepEqual(doc.text(), expected, 'empty string')
  t.end()
})

//plaintext -- same as text
test('plaintext - get - get the plaintext version of the document', (t) => {
  const str = readPage('Remote-Data-Services')
  const doc = wtf(str)
  const expected =
    'Remote Data Services (RDS, formerly known as Advanced Data Connector or ADC) is a Microsoft technology used in conjunction with ActiveX Data Objects (ADO) that allowed the retrieval of a set of data from a database server, which the client then altered in some way and then sent back to the server for further processing. With the popular adoption of Transact-SQL, which extends SQL with such programming constructs as loops and conditional statements, this became less necessary and it was eventually deprecated in Microsoft Data Access Components version 2.7. Microsoft produced SOAP Toolkit 2.0, which allows clients to do this via an open XML-based standard.\n\n\n * MSDN Remote Data Service (RDS) description'
  t.deepEqual(doc.text(), expected, 'Text version of the document')
  t.end()
})

test('plaintext - get - enpty string for redirects', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  const expected = ''
  t.deepEqual(doc.text(), expected, 'empty string')
  t.end()
})

//debug
//we need something like sinon for mocking the console.log

//content accessors
test('supported content accessors exist', (t) => {
  const doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  const accessors = [
    'section',
    'infobox',
    'sentence',
    'citations',
    'references',
    'coordinates',
    'tables',
    'lists',
    'links',
    'images',
    'template',
    'categories',
  ]
  accessors.forEach((s) => {
    t.equal(typeof doc[s], 'function', 'every function needs to be defined. also ' + s)
  })
  t.end()
})
