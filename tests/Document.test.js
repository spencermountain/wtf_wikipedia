const test = require('tape')
const wtf = require('./lib')
const fs = require('fs')
const path = require('path')

//title
test('Tile - get - first sentence', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(doc.title(), 'Charles Frank Milstead', 'the title equals the fist bolded text')
  t.end()
})

test('Tile - get - no bold in sentence ', (t) => {
  let str = 'no bold in first sentence'
  let doc = wtf(str)
  t.equal(doc.title(), undefined, 'the title equals undefined')
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
  let doc = wtf('', {pageID: 1})
  t.equal(doc.pageID(), 1, 'the pageID equals 1')
  t.end()
})

test('pageID - get / set - if the pageID is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.pageID(1)
  t.equal(doc.pageID(), 1, 'the pageID equals 1')
  t.end()
})

//wikidata
test('wikidata - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.wikidata(), null, 'the wikidata equals null')
  t.end()
})

test('wikidata - get - if the wikidata is already set than get it from internal object', (t) => {
  let doc = wtf('', {wikidata: 'Q42'})
  t.equal(doc.wikidata(), 'Q42', 'the wikidata equals \'Q42\'')
  t.end()
})

test('wikidata - get / set - if the wikidata is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.wikidata('Q42')
  t.equal(doc.wikidata(), 'Q42', 'the wikidata equals \'Q42\'')
  t.end()
})

//domain
test('domain - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.domain(), null, 'the null equals undefined')
  t.end()
})

test('domain - get - if the domain is already set than get it from internal object', (t) => {
  let doc = wtf('', {domain: 'wikidata.org'})
  t.equal(doc.domain(), 'wikidata.org', 'the domain equals \'wikidata.org\'')
  t.end()
})

test('domain - get / set - if the domain is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.domain('wikidata.org')
  t.equal(doc.domain(), 'wikidata.org', 'the domain equals \'wikidata.org\'')
  t.end()
})

//language  - Same test as lang
test('language - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.language(), null, 'the language equals null')
  t.end()
})

test('language - get - if the language is already set than get it from internal object', (t) => {
  let doc = wtf('', {language: 'nl'})
  t.equal(doc.language(), 'nl', 'the language equals \'nl\'')
  t.end()
})

test('language - get / set - if the language is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.language('nl')
  t.equal(doc.language(), 'nl', 'the language equals \'nl\'')
  t.end()
})

//lang - Same test as language
test('lang - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.lang(), null, 'the lang equals null')
  t.end()
})

test('lang - get - if the lang is already set than get it from internal object', (t) => {
  let doc = wtf('', {language: 'nl'})
  t.equal(doc.lang(), 'nl', 'the lang equals \'nl\'')
  t.end()
})

test('lang - get / set - if the lang is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.lang('nl')
  t.equal(doc.lang(), 'nl', 'the lang equals \'nl\'')
  t.end()
})

//url
test('url - get - if there is no title return null', (t) => {
  let doc = wtf('')
  t.equal(doc.url(), null, 'the url equals null')
  t.end()
})

test('url - get - if lang and domain are undefined then default to en.wikipedia.org', (t) => {
  let doc = wtf('', {title: 'Barack Obama'})
  t.equal(doc.url(), 'https://en.wikipedia.org/wiki/Barack_Obama', 'the url equals the right page')
  t.end()
})

test('url - get - if lang and domain are set then use them', (t) => {
  let doc = wtf('', {title: 'Barack Obama', language: 'military', domain: 'wikia.org'})
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
  let doc = wtf('', {ns: 'talk'})
  t.equal(doc.namespace(), 'talk', 'the namespace equals \'talk\'')
  t.end()
})

test('namespace - get - if the namespace is already set the other way than get it from internal object', (t) => {
  let doc = wtf('', {namespace: 'talk'})
  t.equal(doc.namespace(), 'talk', 'the namespace equals \'talk\'')
  t.end()
})

test('namespace - get / set - if the namespace is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.namespace('talk')
  t.equal(doc.namespace(), 'talk', 'the namespace equals \'talk\'')
  t.end()
})

//ns - same test as namespace
test('ns - get - should initially be null', (t) => {
  let doc = wtf('')
  t.equal(doc.ns(), null, 'the ns equals null')
  t.end()
})

test('ns - get - if the ns is already set than get it from internal object', (t) => {
  let doc = wtf('', {ns: 'talk'})
  t.equal(doc.ns(), 'talk', 'the ns equals \'talk\'')
  t.end()
})

test('ns - get - if the ns is already set the other way than get it from internal object', (t) => {
  let doc = wtf('', {ns: 'talk'})
  t.equal(doc.ns(), 'talk', 'the ns equals \'talk\'')
  t.end()
})

test('ns - get / set - if the ns is set then it should return the same ', (t) => {
  let doc = wtf('')
  doc.ns('talk')
  t.equal(doc.ns(), 'talk', 'the ns equals \'talk\'')
  t.end()
})

//isRedirect
test('isRedirect - get - should initially be false', (t) => {
  let doc = wtf('')
  t.equal(doc.isRedirect(), false, 'the isRedirect equals false')
  t.end()
})

test('isRedirect - get - if the type of page is should default to page and return false', (t) => {
  let doc = wtf('', {type: 'redirect'})
  t.equal(doc.isRedirect(), false, 'the isRedirect equals false')
  t.end()
})

test('isRedirect - get - if the page is a redirect than return true', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')
  t.equal(doc.isRedirect(), true, 'the isRedirect equals true')
  t.end()
})

test('isRedirect - get - if the page is too long to be a redirect page than return false', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]' + 'l'.repeat(505))
  t.equal(doc.isRedirect(), false, 'the isRedirect equals false')
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
  t.deepEqual(doc.redirectTo(), {page: 'Doelpagina', raw: '[[Doelpagina]]'}, 'the redirectTo equals \'Doelpagina\'')
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
  t.deepEqual(doc.redirectsTo(), {page: 'Doelpagina', raw: '[[Doelpagina]]'}, 'the redirectsTo equals \'Doelpagina\'')
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
  t.deepEqual(doc.redirect(), {page: 'Doelpagina', raw: '[[Doelpagina]]'}, 'the redirect equals \'Doelpagina\'')
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
  t.deepEqual(doc.redirects(), {page: 'Doelpagina', raw: '[[Doelpagina]]'}, 'the redirects equals \'Doelpagina\'')
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
  let doc = wtf('', {categories: ['Q42']})
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
  t.equal(doc.categories(1), 'Writers from New York City', 'the categories at index 1')
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
  let doc = wtf('', {sections: ['Q42']})
  t.deepEqual(doc.sections(), [], 'the sections equals []')
  t.end()
})

test('sections - get - if the clue is a undefined / unset return the list of categories', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [321, 401, 0]

  t.deepEqual(doc.sections().map(s => s.text().length), expected, 'the sections in the wiki text')
  t.end()
})

test('sections - get - if the clue is a number return the sections in that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)

  t.equal(doc.sections(1).text().length, 401, 'the section at index 1')
  t.end()
})

test('sections - get - if the clue is a string return the sections of that title', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)

  t.equal(doc.sections('Career').text().length, 401, 'the section with the title "Career"')
  t.end()
})

test('sections - get - if the clue is a string return the sections of that title even if the cases dont match', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)

  t.equal(doc.sections('CAREER').text().length, 401, 'the section with the title "Career"')
  t.end()
})

//paragraphs
test('paragraphs - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.paragraphs(), [], 'the paragraphs equals []')
  t.end()
})

test('paragraphs - get - if the paragraphs is in the option. ignore it', (t) => {
  let doc = wtf('', {paragraphs: ['Q42']})
  t.deepEqual(doc.paragraphs(), [], 'the paragraphs equals []')
  t.end()
})

test('paragraphs - get - if the clue is a undefined / unset return the list of paragraphs', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  const expected = [804, 66, 567, 474, 169, 159, 136, 167, 137, 451, 44, 17]

  t.deepEqual(doc.paragraphs().map((p) => p.text().length), expected, 'the paragraphs in the wiki text')
  t.end()
})

test('paragraphs - get - if the clue is a number return the paragraph at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.equal(JSON.stringify(doc.paragraphs(1).text().length), '66', 'the paragraph at index 1')
  t.end()
})

test('paragraphs - get - if the clue is a string (not number) return all the paragraphs', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  const expected = [804, 66, 567, 474, 169, 159, 136, 167, 137, 451, 44, 17]

  t.deepEqual(doc.paragraphs('string').map((p) => p.text().length), expected, 'the paragraphs in the wiki text')
  t.end()
})

//paragraph
test('paragraph - get - if the clue is a number return the paragraph at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraph as an analogue for the content.
  t.equal(JSON.stringify(doc.paragraph(1).text().length), '66', 'the paragraph at index 1')
  t.end()
})

test('paragraph - get - if the clue is unset or undefined return the first paragraph', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraph as an analogue for the content.
  t.equal(JSON.stringify(doc.paragraph().text().length), '804', 'the paragraph at index 0')
  t.end()
})

test('paragraph - get - if the clue is not a number return the first paragraph', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraph as an analogue for the content.
  t.equal(JSON.stringify(doc.paragraph('string').text().length), '804', 'the paragraph at index 0')
  t.end()
})

//sentences
test('sentences - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.sentences(), [], 'the sentences equals []')
  t.end()
})

test('sentences - get - if the sentences is in the option. ignore it', (t) => {
  let doc = wtf('', {sentences: ['Q42']})
  t.deepEqual(doc.sentences(), [], 'the sentences equals []')
  t.end()
})

test('sentences - get - if the clue is a undefined / unset return the list of sentences', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the sentences as an analogue for the content.
  const expected = [90, 77, 104, 55, 62, 58, 94, 45, 91, 75, 43, 66, 126, 128, 100, 210, 83, 187, 43, 56, 101, 65, 103, 90, 68, 136, 91, 75, 122, 14, 116, 48, 98, 186, 17]

  t.deepEqual(doc.sentences().map((p) => p.text().length), expected, 'the sentences in the wiki text')
  t.end()
})

test('sentences - get - if the clue is a number return the paragraph at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the sentences as an analogue for the content.
  t.equal(JSON.stringify(doc.sentences(1).text().length), '77', 'the sentences at index 1')
  t.end()
})

test('sentences - get - if the clue is a string (not number) return all the sentences', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  const expected = [90, 77, 104, 55, 62, 58, 94, 45, 91, 75, 43, 66, 126, 128, 100, 210, 83, 187, 43, 56, 101, 65, 103, 90, 68, 136, 91, 75, 122, 14, 116, 48, 98, 186, 17]

  t.deepEqual(doc.sentences('string').map((p) => p.text().length), expected, 'the sentences in the wiki text')
  t.end()
})
//sentence
test('sentence - get - should return the first sentence', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.sentence().text().length, 90, 'the first sentence in the wiki text')
  t.end()
})

//images
test('images - get - should initially be []', (t) => {
  let doc = wtf('')
  t.deepEqual(doc.images(), [], 'the images equals []')
  t.end()
})

test('images - get - if the images is in the option. ignore it', (t) => {
  let doc = wtf('', {images: ['Q42']})
  t.deepEqual(doc.images(), [], 'the images equals []')
  t.end()
})

test('images - get - if the clue is a undefined / unset return the list of images', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  const expected = [82, 89]

  t.deepEqual(doc.images().map((p) => p.url().length), expected, 'the images in the wiki text')
  t.end()
})

test('images - get - if the clue is a number return the images at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.equal(JSON.stringify(doc.images(1).url().length), '89', 'the images at index 1')
  t.end()
})

test('images - get - if the clue is a string (not number) return all the images', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  const expected = [82, 89]

  t.deepEqual(doc.images('string').map((p) => p.url().length), expected, 'the images in the wiki text')
  t.end()
})

test('images - get - also get images from galeries', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Goryeo-ware.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  const expected = [137, 67, 137, 222, 120]

  t.deepEqual(doc.images('string').map((p) => p.url().length), expected, 'the images in the wiki text')
  t.end()
})

//image
test('image - get - return the first image on the page', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.image().url().length, 82, 'the first image on the page')
  t.end()
})

//links
test('links - get - return all links on the page', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [41, 71, 82, 94, 38, 40, 110, 40]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.links().map(l => JSON.stringify(l.json()).length), expected, 'returns all links')
  t.end()
})

test('links - get - if the clue is a number return the link at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(JSON.stringify(doc.links(1).json()).length, 71, 'the link at index 1')
  t.end()
})

test('links - get - if the clue is a string return the link with that content', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(JSON.stringify(doc.links('Jace Rocker')[0].json()).length, 40, 'the link at index the content \'Jace Rocker\'')
  t.end()
})

test('links - get - if the clue is any other type then return all links', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [41, 71, 82, 94, 38, 40, 110, 40]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.links([]).map(l => JSON.stringify(l.json()).length), expected, 'returns all links')
  t.end()
})

//interwiki
test('interwiki - get - return all interwiki on the page', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [82, 94]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.interwiki().map(l => JSON.stringify(l.json()).length), expected, 'returns all interwiki')
  t.end()
})

test('interwiki - get - if the clue is a number return the interwiki at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(JSON.stringify(doc.interwiki(1).json()).length, 94, 'the interwiki at index 1')
  t.end()
})

test('interwiki - get - if the clue is any other type then return all interwiki', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [82, 94]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.interwiki([]).map(l => JSON.stringify(l.json()).length), expected, 'returns all interwiki')
  t.end()
})

//lists
test('lists - get - return all lists on the page', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'anarchism.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [1946, 815, 4911, 197, 2290, 428]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.lists().map(l => JSON.stringify(l.json()).length), expected, 'returns all lists')
  t.end()
})

test('lists - get - if the clue is a number return the lists at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'anarchism.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(JSON.stringify(doc.lists(1).json()).length, 815, 'the lists at index 1')
  t.end()
})

test('lists - get - if the clue is any other type then return all lists', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'anarchism.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [1946, 815, 4911, 197, 2290, 428]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.lists('string').map(l => JSON.stringify(l.json()).length), expected, 'returns all lists')
  t.end()
})
//tables
test('tables - get - return all tables', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [1638, 783]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.tables().map(l => JSON.stringify(l.json()).length), expected, 'returns all tables')
  t.end()
})

test('tables - get - if the clue is a number return the tables at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(JSON.stringify(doc.tables(1).json()).length, 783, 'the tables at index 1')
  t.end()
})

test('tables - get - if the clue is any other type then return all tables', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [1638, 783]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.tables('string').map(l => JSON.stringify(l.json()).length), expected, 'returns all tables')
  t.end()
})

//templates
test('templates - get - return all templates', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [13, 12, 5, 4, 4, 7, 7, 18]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.templates().map(te => te.template.length), expected, 'returns all templates')
  t.end()
})

test('templates - get - if the clue is a number return the templates at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.templates(1).template.length, 12, 'the templates at index 1')
  t.end()
})

test('templates - get - if the clue is any other type then return all templates', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [13, 12, 5, 4, 4, 7, 7, 18]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.templates().map(te => te.template.length), expected, 'returns all templates')
  t.end()
})

//references -- same as citations
test('references - get - return all templates', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [19, 3, 33, 32, 44, 0, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0, 0, 31, 71, 0, 0, 0, 0, 0, 0, 0, 13, 13, 0, 0, 10, 0, 0, 0]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.references().map(r => r.title().length), expected, 'returns all references')
  t.end()
})

test('references - get - if the clue is a number return the references at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.references(1).title().length, 3, 'the references at index 1')
  t.end()
})

test('references - get - if the clue is any other type then return all references', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [19, 3, 33, 32, 44, 0, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0, 0, 31, 71, 0, 0, 0, 0, 0, 0, 0, 13, 13, 0, 0, 10, 0, 0, 0]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.references('string').map(re => re.title().length), expected, 'returns all references')
  t.end()
})

//citations -- same as references
test('citations - get - return all templates', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [19, 3, 33, 32, 44, 0, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0, 0, 31, 71, 0, 0, 0, 0, 0, 0, 0, 13, 13, 0, 0, 10, 0, 0, 0]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.citations().map(c => c.title().length), expected, 'returns all citations')
  t.end()
})

test('citations - get - if the clue is a number return the citations at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.citations(1).title().length, 3, 'the citations at index 1')
  t.end()
})

test('citations - get - if the clue is any other type then return all references', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [19, 3, 33, 32, 44, 0, 0, 0, 0, 0, 0, 0, 31, 0, 0, 0, 0, 31, 71, 0, 0, 0, 0, 0, 0, 0, 13, 13, 0, 0, 10, 0, 0, 0]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.citations('string').map(ci => ci.title().length), expected, 'returns all citations')
  t.end()
})

//coordinates
test('coordinates - get - return all coordinates', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Dollar-Point,-California.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [
    {
      display: 'inline,title',
      template: 'coord',
      props: {region: 'US_type:city'},
      lat: 39.18861,
      lon: -120.10889,
    },
    {
      template: 'coord',
      props: {type: 'city'},
      lat: 39.18861,
      lon: -120.10889,
    },
  ]

  t.deepEqual(doc.coordinates(), expected, 'returns all coordinates')
  t.end()
})

test('coordinates - get - if the clue is a number return the coordinates at that index', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Dollar-Point,-California.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = {
    template: 'coord',
    props: {type: 'city'},
    lat: 39.18861,
    lon: -120.10889,
  }

  t.deepEqual(doc.coordinates(1), expected, 'the coordinates at index 1')
  t.end()
})

test('coordinates - get - if the clue is any other type then return all coordinates', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Dollar-Point,-California.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = [
    {
      display: 'inline,title',
      template: 'coord',
      props: {region: 'US_type:city'},
      lat: 39.18861,
      lon: -120.10889,
    },
    {
      template: 'coord',
      props: {type: 'city'},
      lat: 39.18861,
      lon: -120.10889,
    },
  ]

  t.deepEqual(doc.coordinates('string'), expected, 'returns all coordinates')
  t.end()
})

//infoboxes
const infoboxPage = `
{{Infobox venue
| name = Royal Cinema
| nickname            =
| former names        = The Pylon, The Golden Princess
| logo_image          =
| logo_caption        =
}}
{{Infobox venue
| name = Royal Cinema
| nickname            =
| former names        = The Pylon, The Golden Princess
| logo_image          =
| logo_caption        =
| image               = Royal_Cinema.JPG
| image_size          = 250px
| caption             = The Royal Cinema in 2009
}}
{{Infobox venue
| name = Royal Cinema
| nickname            =
| former names        = The Pylon, The Golden Princess
| logo_image          =
| logo_caption        =
| image               = Royal_Cinema.JPG
| image_size          = 250px
| caption             = The Royal Cinema in 2009
}}
`

test('references - get - return all templates', (t) => {
  let doc = wtf(infoboxPage)

  const expected = [201, 201, 89]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.infoboxes().map(i => JSON.stringify(i.json()).length), expected, 'returns all references')
  t.end()
})

test('references - get - if the clue is a number return the references at that index', (t) => {
  let doc = wtf(infoboxPage)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(JSON.stringify(doc.infoboxes(1).json()).length, 201, 'the references at index 1')
  t.end()
})

test('references - get - if the clue is any other type then return all references', (t) => {
  let doc = wtf(infoboxPage)

  const expected = [201, 201, 89]

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.infoboxes('string').map(info => JSON.stringify(info.json()).length), expected, 'returns all references')
  t.end()
})

//text
test('text - get - get the text version of the document', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Remote-Data-Services.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = 'Remote Data Services (RDS, formerly known as Advanced Data Connector or ADC) is a Microsoft technology used in conjunction with ActiveX Data Objects (ADO) that allowed the retrieval of a set of data from a database server, which the client then altered in some way and then sent back to the server for further processing. With the popular adoption of Transact-SQL, which extends SQL with such programming constructs as loops and conditional statements, this became less necessary and it was eventually deprecated in Microsoft Data Access Components version 2.7. Microsoft produced SOAP Toolkit 2.0, which allows clients to do this via an open XML-based standard.\n\n\n * MSDN Remote Data Service (RDS) description'
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
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Remote-Data-Services.txt'), 'utf-8')
  let doc = wtf(str)

  const expected = 'Remote Data Services (RDS, formerly known as Advanced Data Connector or ADC) is a Microsoft technology used in conjunction with ActiveX Data Objects (ADO) that allowed the retrieval of a set of data from a database server, which the client then altered in some way and then sent back to the server for further processing. With the popular adoption of Transact-SQL, which extends SQL with such programming constructs as loops and conditional statements, this became less necessary and it was eventually deprecated in Microsoft Data Access Components version 2.7. Microsoft produced SOAP Toolkit 2.0, which allows clients to do this via an open XML-based standard.\n\n\n * MSDN Remote Data Service (RDS) description'
  t.deepEqual(doc.plaintext(), expected, 'Text version of the document')
  t.end()
})

test('plaintext - get - enpty string for redirects', (t) => {
  let doc = wtf('#DOORVERWIJZING [[Doelpagina]]')

  const expected = ''

  t.deepEqual(doc.plaintext(), expected, 'empty string')
  t.end()
})

//json
test('json - get - get the json version of the document', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Remote-Data-Services.txt'), 'utf-8')
  let doc = wtf(str)

  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(JSON.stringify(doc.json()).length, 1971, 'JSON version of the document')
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

test('plurals / singular - all should exist', (t) => {
  let str = fs.readFileSync(path.join(__dirname, 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)

  let singels = {
    'section': [
      {
        clue: undefined,
        json: true,
        expected: {
          'title': '',
          'depth': 0,
          'paragraphs': [{
            'sentences': [{
              'text': 'Arts Club of Chicago is a private club located in the Near North Side community area of Chicago in Cook County, Illinois, United States, a block east of the Magnificent Mile, that exhibits international contemporary art.',
              'links': [{
                'text': 'Near North Side',
                'type': 'internal',
                'page': 'Near North Side, Chicago',
              }, {
                'text': 'community area',
                'type': 'internal',
                'page': 'Community areas of Chicago',
              }, {'type': 'internal', 'page': 'Chicago'}, {
                'type': 'internal',
                'page': 'Cook County, Illinois',
              }, {'type': 'internal', 'page': 'Magnificent Mile'}, {
                'text': 'contemporary art',
                'type': 'internal',
                'page': 'contemporary art',
              }],
              'formatting': {'bold': ['Arts Club of Chicago']},
            }, {
              'text': 'It was founded in 1916, inspired by the success of the Art Institute of Chicago\'s handling of the Armory Show.',
              'links': [{'type': 'internal', 'page': 'Art Institute of Chicago'}, {
                'type': 'internal',
                'page': 'Armory Show',
              }],
            }, {'text': 'Its founding was viewed as a statement that art had become an important component of civilized urban life.'}, {
              'text': 'The Arts Club is said to have been pro-Modernist from its founding.',
              'links': [{'text': 'Modernist', 'type': 'internal', 'page': 'Modernism'}],
            }, {'text': 'The Club strove to break new ground with its shows, rather than collect the works of established artists as the Art Institute does.'}],
          }, {
            'sentences': [{
              'text': 'The club presented Pablo Picasso\'s first United States showing.',
              'links': [{'type': 'internal', 'page': 'Pablo Picasso'}],
            }, {
              'text': 'In addition, the 1951 exhibition by Jean Dubuffet and his "Anticultural Positions" lecture at the Arts Club were tremendous influences on what would become the mid-1960s Imagist movement.',
              'links': [{'type': 'internal', 'page': 'Jean Dubuffet'}, {'type': 'internal', 'page': 'Imagist'}],
            }, {
              'text': 'Another important presentation in the history of the Arts Club was the Fernand Léger showing of Le Ballet Mecanique.',
              'links': [{'type': 'internal', 'page': 'Fernand Léger'}],
              'formatting': {'italic': ['Le Ballet Mecanique']},
            }],
          }, {
            'sentences': [{
              'text': 'The Club\'s move in 1997 to its current location at 201 E. Ontario Street was not without controversy because the club demolished its former interior space designed by Ludwig Mies van der Rohe and moved only the central staircase to the new gallery space.',
              'links': [{'type': 'internal', 'page': 'Ludwig Mies van der Rohe'}],
            }, {'text': 'However, the new space is 19000 sqft, which is 7000 sqft larger than the old space.'}],
          }],
          'templates': [{
            'date': 'August 2016',
            'template': 'use mdy dates',
          }, {'template': 'good article'}, {
            'display': 'inline',
            'template': 'coord',
            'lat': 41.89327,
            'lon': -87.62251,
          }],
          'infoboxes': [{
            'name': {'text': 'Arts Club of Chicago'},
            'pushpin_map': {'text': 'United States Chicago Near North Side'},
            'coordinates': {'text': '41.89327°N, -87.62251°W'},
            'map_caption': {
              'text': 'Location within Chicago\'s Near North Side community area',
              'links': [{
                'text': 'Near North Side',
                'type': 'internal',
                'page': 'Near North Side, Chicago',
              }, {'text': 'community area', 'type': 'internal', 'page': 'Community areas of Chicago'}],
            },
            'image': {'text': '20070701 Arts Club of Chicago.JPG'},
            'established': {'text': '1916 (current location since April 4, 1997)'},
            'location': {
              'text': '201 E. Ontario Street, Chicago, Illinois 60611 United States 🇺🇸',
              'links': [{'type': 'internal', 'page': 'Chicago'}, {
                'type': 'internal',
                'page': 'Illinois',
              }, {'text': '🇺🇸', 'type': 'internal', 'page': 'united states'}],
            },
            'website': {
              'text': 'www.artsclubchicago.org',
              'links': [{
                'text': 'www.artsclubchicago.org',
                'type': 'external',
                'site': 'http://www.artsclubchicago.org',
              }],
            },
          }],
          'references': [{
            'url': 'http://www.encyclopedia.chicagohistory.org/pages/70.html',
            'author': 'Kruty, Paul',
            'title': 'Armory Show of 1913',
            'accessdate': 'June 27, 2007',
            'year': '2005',
            'publisher': 'Chicago Historical Society',
            'work': 'The Electronic Encyclopedia of Chicago',
            'template': 'citation',
            'type': 'web',
          }, {
            'url': 'http://www.encyclopedia.chicagohistory.org/pages/72.html',
            'author': 'Warren, Lynne',
            'title': 'Art',
            'accessdate': 'June 27, 2007',
            'year': '2005',
            'publisher': 'Chicago Historical Society',
            'work': 'The Electronic Encyclopedia of Chicago',
            'template': 'citation',
            'type': 'web',
          }, {
            'url': 'http://www.encyclopedia.chicagohistory.org/pages/83.html',
            'author': 'Roeder George H., Jr.',
            'title': 'Artists, Education and Culture of',
            'accessdate': 'June 27, 2007',
            'year': '2005',
            'publisher': 'Chicago Historical Society',
            'work': 'The Electronic Encyclopedia of Chicago',
            'template': 'citation',
            'type': 'web',
          }, {
            'url': 'http://www.aiachicago.org/special_features/1996_Design_Awards/Unbuilt/Awards/Winners/unbuilt_171.html',
            'archive-url': 'https://web.archive.org/web/20011124011911/http://www.aiachicago.org/special_features/1996_Design_Awards/Unbuilt/Awards/Winners/unbuilt_171.html',
            'dead-url': 'yes',
            'archive-date': 'November 24, 2001',
            'title': 'Honor : The Arts Club of Chicago',
            'accessdate': 'June 28, 2007',
            'publisher': 'American Institute of Architects Chicago',
            'template': 'citation',
            'type': 'web',
          }, {
            'url': 'http://www.artn.com/Building.pdf',
            'title': 'The Arts Club of Chicago Building Fact Sheet',
            'accessdate': 'June 29, 2007',
            'publisher': 'www.artn.com',
            'format': 'PDF',
            'archiveurl': 'https://web.archive.org/web/20060615211113/http://www.artn.com/Building.pdf',
            'archivedate': 'June 15, 2006',
            'template': 'citation',
            'type': 'web',
          }],
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          'title': 'Mission and purpose',
          'depth': 0,
          'paragraphs': [{
            'sentences': [{'text': 'The inaugural mission of the club was "to encourage higher standards of art, maintain galleries for that purpose, and to promote the mutual acquaintance of art lovers and art workers."'}, {
              'text': 'This mission arose from the contemporary Chicago active art scene, which had 30 commercial art galleries showing traditional art and an internationally recognized museum.',
              'links': [{'text': 'art galleries', 'type': 'internal', 'page': 'art gallery'}],
            }, {
              'text': 'Additionally, the local mass media gave equitable coverage to the visual arts.',
              'links': [{'text': 'mass media', 'type': 'internal', 'page': 'mass media'}, {
                'text': 'visual arts',
                'type': 'internal',
                'page': 'visual art',
              }],
            }, {
              'text': 'The art scene also had enough clubs and organizations for musicians, writers and artists.',
              'links': [{'text': 'artists', 'type': 'internal', 'page': 'artist'}],
            }, {
              'text': 'Unfortunately, the lively art scene did not adequately represent the avant-garde art.',
              'links': [{'text': 'avant-garde', 'type': 'internal', 'page': 'avant-garde'}],
            }, {'text': 'The local galleries emphasized American, English and the occasional French work, emphasizing prints and drawings.'}, {'text': 'This necessitated trips to New York City, London or Paris for Chicagoans who wanted to buy art.'}],
          }, {'sentences': [{'text': 'The club does not generally show traveling exhibitions curated by others.'}, {'text': 'Instead, it curates its own exhibits, often with very original works.'}, {'text': 'This places emphasis on cutting edge and avant-garde art.'}]}],
          'references': [{'template': 'citation', 'type': 'inline', 'data': {}, 'inline': {}}],
        },
      },
    ],
    'infobox': [
      {
        clue: undefined,
        json: true,
        expected: {
          name: {text: 'Arts Club of Chicago'},
          pushpin_map: {text: 'United States Chicago Near North Side'},
          coordinates: {text: '41.89327°N, -87.62251°W'},
          map_caption: {
            text: 'Location within Chicago\'s Near North Side community area',
            links: [{
              text: 'Near North Side',
              type: 'internal',
              page: 'Near North Side, Chicago',
            }, {text: 'community area', type: 'internal', page: 'Community areas of Chicago'}],
          },
          image: {text: '20070701 Arts Club of Chicago.JPG'},
          established: {text: '1916 (current location since April 4, 1997)'},
          location: {
            text: '201 E. Ontario Street, Chicago, Illinois 60611 United States 🇺🇸',
            links: [{text: undefined, type: 'internal', page: 'Chicago'}, {
              text: undefined,
              type: 'internal',
              page: 'Illinois',
            }, {text: '🇺🇸', type: 'internal', page: 'united states'}],
          },
          website: {
            text: 'www.artsclubchicago.org',
            links: [{text: 'www.artsclubchicago.org', type: 'external', site: 'http://www.artsclubchicago.org'}],
          },
        },
      },
      {
        clue: 0,
        json: true,
        expected: {
          name: {text: 'Arts Club of Chicago'},
          pushpin_map: {text: 'United States Chicago Near North Side'},
          coordinates: {text: '41.89327°N, -87.62251°W'},
          map_caption: {
            text: 'Location within Chicago\'s Near North Side community area',
            links: [{
              text: 'Near North Side',
              type: 'internal',
              page: 'Near North Side, Chicago',
            }, {text: 'community area', type: 'internal', page: 'Community areas of Chicago'}],
          },
          image: {text: '20070701 Arts Club of Chicago.JPG'},
          established: {text: '1916 (current location since April 4, 1997)'},
          location: {
            text: '201 E. Ontario Street, Chicago, Illinois 60611 United States 🇺🇸',
            links: [{text: undefined, type: 'internal', page: 'Chicago'}, {
              text: undefined,
              type: 'internal',
              page: 'Illinois',
            }, {text: '🇺🇸', type: 'internal', page: 'united states'}],
          },
          website: {
            text: 'www.artsclubchicago.org',
            links: [{text: 'www.artsclubchicago.org', type: 'external', site: 'http://www.artsclubchicago.org'}],
          },
        },
      },
    ],
    'sentence': [
      {
        clue: undefined,
        json: true,
        expected: {
          text: 'Arts Club of Chicago is a private club located in the Near North Side community area of Chicago in Cook County, Illinois, United States, a block east of the Magnificent Mile, that exhibits international contemporary art.',
          links: [
            {
              text: 'Near North Side',
              type: 'internal',
              page: 'Near North Side, Chicago',
            },
            {text: 'community area', type: 'internal', page: 'Community areas of Chicago'},
            {
              text: undefined,
              type: 'internal',
              page: 'Chicago',
            },
            {text: undefined, type: 'internal', page: 'Cook County, Illinois'}, {
              text: undefined,
              type: 'internal',
              page: 'Magnificent Mile',
            },
            {text: 'contemporary art', type: 'internal', page: 'contemporary art'},
          ],
          formatting: {bold: ['Arts Club of Chicago']},
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          'text': 'It was founded in 1916, inspired by the success of the Art Institute of Chicago\'s handling of the Armory Show.',
          'links': [{'type': 'internal', 'page': 'Art Institute of Chicago'}, {
            'type': 'internal',
            'page': 'Armory Show',
          }],
        },
      },
    ],
    'citation': [
      {
        clue: undefined,
        json: true,
        expected: {
          url: 'http://www.encyclopedia.chicagohistory.org/pages/70.html',
          author: 'Kruty, Paul',
          title: 'Armory Show of 1913',
          accessdate: 'June 27, 2007',
          year: '2005',
          publisher: 'Chicago Historical Society',
          work: 'The Electronic Encyclopedia of Chicago',
          template: 'citation',
          type: 'web',
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          'url': 'http://www.encyclopedia.chicagohistory.org/pages/72.html',
          'author': 'Warren, Lynne',
          'title': 'Art',
          'accessdate': 'June 27, 2007',
          'year': '2005',
          'publisher': 'Chicago Historical Society',
          'work': 'The Electronic Encyclopedia of Chicago',
          'template': 'citation',
          'type': 'web',
        },
      },
    ],
    'reference': [
      {
        clue: undefined,
        json: true,
        expected: {
          url: 'http://www.encyclopedia.chicagohistory.org/pages/70.html',
          author: 'Kruty, Paul',
          title: 'Armory Show of 1913',
          accessdate: 'June 27, 2007',
          year: '2005',
          publisher: 'Chicago Historical Society',
          work: 'The Electronic Encyclopedia of Chicago',
          template: 'citation',
          type: 'web',
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          'url': 'http://www.encyclopedia.chicagohistory.org/pages/72.html',
          'author': 'Warren, Lynne',
          'title': 'Art',
          'accessdate': 'June 27, 2007',
          'year': '2005',
          'publisher': 'Chicago Historical Society',
          'work': 'The Electronic Encyclopedia of Chicago',
          'template': 'citation',
          'type': 'web',
        },
      },
    ],
    'coordinate': [
      {
        clue: undefined,
        expected: {display: 'inline', template: 'coord', lat: 41.89327, lon: -87.62251},
      },
      {
        clue: 1,
        expected: undefined,
      },
    ],
    'table': [
      {
        clue: undefined,
        json: true,
        expected: [{
          Name: {
            text: 'Fine Arts Building',
            links: [{text: 'Fine Arts Building', type: 'internal', page: 'Fine Arts Building (Chicago)'}],
          },
          'Street Address': {
            text: '401 S. Michigan Avenue',
            links: [{text: 'Michigan Avenue', type: 'internal', page: 'Michigan Avenue (Chicago)'}],
          },
          Years: {text: '1916-18'},
          'Architect/Interior Designer': {text: 'Arthur Heun/Rue Winterbotham Carpenter'},
        }, {
          Name: {text: ''},
          'Street Address': {text: '610 S. Michigan Avenue'},
          Years: {text: '1918-24'},
          'Architect/Interior Designer': {text: 'Arthur Heun/Rue Winterbotham Carpenter'},
        }, {
          Name: {
            text: 'Wrigley Building (north tower)',
            links: [{text: undefined, type: 'internal', page: 'Wrigley Building'}],
          },
          'Street Address': {text: '410 N. Michigan Avenue'},
          Years: {text: '1924-36'},
          'Architect/Interior Designer': {text: 'Arthur Heun/Rue Winterbotham Carpenter'},
        }, {
          Name: {
            text: 'Wrigley Building (south tower)',
            links: [{text: undefined, type: 'internal', page: 'Wrigley Building'}],
          },
          'Street Address': {text: '410 N. Michigan Avenue'},
          Years: {text: '1936-47'},
          'Architect/Interior Designer': {text: 'Arthur Heun/Elizabeth "Bobsy" Goodspeed Chapman'},
        }, {
          Name: {text: ''},
          'Street Address': {text: '109 E. Ontario Street'},
          Years: {text: '1951-95'},
          'Architect/Interior Designer': {
            text: 'Ludwig Mies van der Rohe',
            links: [{text: undefined, type: 'internal', page: 'Ludwig Mies van der Rohe'}],
          },
        }, {
          Name: {text: ''},
          'Street Address': {text: '222 W. Superior Street'},
          Years: {text: '1995-97'},
          'Architect/Interior Designer': {text: ''},
        }, {
          Name: {text: ''},
          'Street Address': {text: '201 E. Ontario Street'},
          Years: {text: '1997-'},
          'Architect/Interior Designer': {text: 'Vinci/Hamp Architects, Inc.'},
        }],

      },
      {
        clue: 1,
        json: true,
        expected: [{
          'Name': {'text': 'Mrs. Robert McGann'},
          'Years': {'text': '1916-18'},
        }, {
          'Name': {'text': 'Rue Winterbotham Carpenter'},
          'Years': {'text': '1918-31'},
        }, {
          'Name': {'text': 'Elizabeth "Bobsy" Goodspeed'},
          'Years': {'text': '1932-40'},
        }, {
          'Name': {'text': 'Mrs. William B. Hale'},
          'Years': {'text': '1940', 'number': 1940},
        }, {
          'Name': {'text': 'Rue Winterbotham Shaw'},
          'Years': {'text': '1940-79'},
        }, {
          'Name': {'text': 'Mrs. Roger Barnett'},
          'Years': {'text': '1979', 'number': 1979},
        }, {
          'Name': {'text': 'James Phinney Baxter IV'},
          'Years': {'text': '1979-81'},
        }, {
          'Name': {'text': 'Stanley M. Freehling'},
          'Years': {'text': '1981–2005'},
        }, {'Name': {'text': 'Marilynn B. Alsdorf'}, 'Years': {'text': '2006–2011'}}, {
          'Name': {'text': 'Sophia Shaw'},
          'Years': {'text': '2011–2013'},
        }, {'Name': {'text': 'Helyn Goldenberg'}, 'Years': {'text': '2013–present'}}],
      },
    ],
    'list': [
      {
        clue: undefined,
        json: true,
        expected: [{
          'text': 'Red Petals, plate steel, steel wire, sheet aluminum, soft-iron bolts, and aluminum paint, 1942, by Alexander Calder',
          'formatting': {'italic': ['Red Petals']},
        }, {
          'text': 'Main Staircase for The Arts Club of Chicago, steel, travertine marble, 1948-1951, by Ludwig Mies van der Rohe',
          'formatting': {'italic': ['Main Staircase for The Arts Club of Chicago']},
        }, {
          'text': 'Untitled, charcoal on ivory laid paper, 1922, by Henri Matisse',
          'links': [{'text': 'charcoal', 'type': 'internal', 'page': 'charcoal'}],
          'formatting': {'italic': ['Untitled']},
        }, {
          'text': 'Personage and Birds in Front of the Sun (Personnage et oiseaux devant le soleil), ink and gouache on paper, 1942, by Joan Miró',
          'formatting': {'italic': ['Personage and Birds in Front of the Sun (Personnage et oiseaux devant le soleil)']},
        }, {
          'text': 'This Thing is Made to Perpetuate My Memory (Cette Chose est faite pour perpetuer mon souvenir), ink, gouache or watercolor, and silver and bronze paint on board, 1915, by Francis Picabia',
          'formatting': {'italic': ['This Thing is Made to Perpetuate My Memory (Cette Chose est faite pour perpetuer mon souvenir)']},
        }, {
          'text': 'Head of a Woman (Tete de femme), red and black chalk with chalk wash on tan laid paper, laid down on lightweight Japanese paper, 1922, by Pablo Picasso',
          'formatting': {'italic': ['Head of a Woman (Tete de femme)']},
        }],
      },
      {
        clue: 1,
        json: true,
        expected: [{
          'text': 'Fitzgerald, Michael C. (1984). Making Modernism: Picasso and the Creation of the Market for Twentieth Century Art. Farrar Straus & Giroux. ISBN: 0-37410-611-8.',
          'formatting': {'italic': ['Making Modernism: Picasso and the Creation of the Market for Twentieth Century Art']},
        }, {
          'text': 'Shaw, Sophia (ed.) (1997). The Arts Club of Chicago: The Collection 1916-1996. The Arts Club of Chicago. ISBN: 0-96434-403-3.',
          'links': [{
            'text': 'The Arts Club of Chicago: The Collection 1916-1996',
            'type': 'external',
            'site': 'https://web.archive.org/web/20060918054331/http://www.press.uchicago.edu/cgi-bin/hfs.cgi/00/13456.ctl',
          }],
          'formatting': {'italic': ['The Arts Club of Chicago: The Collection 1916-1996']},
        }, {
          'text': 'Wells, James M. (1992). The Arts Club of Chicago: Seventy-Fifth Anniversary.',
          'formatting': {'italic': ['The Arts Club of Chicago: Seventy-Fifth Anniversary']},
        }],
      },
    ],
    'link': [
      {
        clue: undefined,
        json: true,
        expected: {
          text: 'Near North Side',
          type: 'internal',
          page: 'Near North Side, Chicago',
        },
      },
      {
        clue: 1,
        json: true,
        expected: {'text': 'community area', 'type': 'internal', 'page': 'Community areas of Chicago'},
      },
    ],
    'image': [
      {
        clue: undefined,
        json: true,
        expected: {
          file: '20070701 Arts Club of Chicago.JPG',
          thumb: 'https://wikipedia.org/wiki/Special:Redirect/file/20070701_Arts_Club_of_Chicago.JPG?width=300',
          url: 'https://wikipedia.org/wiki/Special:Redirect/file/20070701_Arts_Club_of_Chicago.JPG',
        },
      },
      {
        clue: 1,
        json: true,
        expected: {
          'file': 'File:20070711 Mies van der Rohe Staircase.JPG',
          'thumb': 'https://wikipedia.org/wiki/Special:Redirect/file/20070711_Mies_van_der_Rohe_Staircase.JPG?width=300',
          'url': 'https://wikipedia.org/wiki/Special:Redirect/file/20070711_Mies_van_der_Rohe_Staircase.JPG',
          'caption': 'Mies van der Rohe staircase and Alexander Calder mobile',
          'links': [],
        },
      },
    ],
    'template': [
      {clue: undefined, expected: {date: 'August 2016', template: 'use mdy dates'}},
      {clue: 1, expected: {'template': 'good article'}},
    ],
    'category': [
      {clue: undefined, expected: '1916 establishments in Illinois'},
      {clue: 1, expected: 'Museums in Chicago'},
    ],
  }

  Object.keys(singels).forEach((fn) => {
    singels[fn].forEach(testCase => {
      const result = testCase.json ? doc[fn](testCase.clue).json() : doc[fn](testCase.clue)
      //console.log(JSON.stringify(result))
      t.deepEqual(JSON.stringify(result), JSON.stringify(testCase.expected), 'expect doc.' + fn + '(' + testCase.clue + ') to equal ' + testCase.expected)
    })

  })
  t.end()
})
