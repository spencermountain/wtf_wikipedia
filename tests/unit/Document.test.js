import test from 'tape'
import wtf from '../lib/index.js'
import fs from 'fs'
import path from 'path'
const dir = new URL('./', import.meta.url).pathname

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

test('sections - get - if the clue is a undefined / unset return the list of categories', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [321, 401, 0]
  t.deepEqual(
    doc.sections().map((s) => s.text().length),
    expected,
    'the sections in the wiki text'
  )
  t.end()
})

test('sections - get - if the clue is a number return the sections in that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(doc.section(1).text().length, 401, 'the section at index 1')
  t.end()
})

test('sections - get - if the clue is a string return the sections of that title', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(doc.section('Career').text().length, 401, 'the section with the title "Career"')
  t.end()
})

test('sections - get - if the clue is a string return the sections of that title even if the cases dont match', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Charlie-Milstead.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(doc.section('CAREER').text().length, 401, 'the section with the title "Career"')
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
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [804, 66, 567, 474, 169, 159, 136, 167, 137, 451, 44, 17]
  t.deepEqual(
    doc.paragraphs().map((p) => p.text().length),
    expected,
    'the paragraphs in the wiki text'
  )
  t.end()
})

test('paragraphs - get - if the clue is a number return the paragraph at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  //I used the length of the paragraphs as an analogue for the content.
  t.equal(JSON.stringify(doc.paragraph(1).text().length), '66', 'the paragraph at index 1')
  t.end()
})

test('paragraphs - get - if the clue is a string (not number) return all the paragraphs', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [804, 66, 567, 474, 169, 159, 136, 167, 137, 451, 44, 17]
  t.deepEqual(
    doc.paragraphs('string').map((p) => p.text().length),
    expected,
    'the paragraphs in the wiki text'
  )
  t.end()
})

//paragraph
test('paragraph - get - if the clue is a number return the paragraph at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(JSON.stringify(doc.paragraph(1).text().length), '66', 'the paragraph at index 1')
  t.end()
})

test('paragraph - get - if the clue is unset or undefined return the first paragraph', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(JSON.stringify(doc.paragraph().text().length), '804', 'the paragraph at index 0')
  t.end()
})

test('paragraph - get - if the clue is not a number return the first paragraph', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
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
  let doc = wtf('', { sentences: ['Q42'] })
  t.deepEqual(doc.sentences(), [], 'the sentences equals []')
  t.end()
})

test('sentences - get - if the clue is a undefined / unset return the list of sentences', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  const expected =
    '90,77,104,55,62,58,94,45,91,75,43,66,126,128,100,210,83,187,43,56,101,65,103,90,68,136,91,75,122,14,116,48,98,186,17'
  t.equal(
    doc
      .sentences()
      .map((p) => p.text().length)
      .join(','),
    expected,
    'the sentences in the wiki text'
  )
  t.end()
})

test('sentences - get - if the clue is a number return the paragraph at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(JSON.stringify(doc.sentence(1).text().length), '77', 'the sentences at index 1')
  t.end()
})

test('sentences - get - if the clue is a string (not number) return all the sentences', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
  const expected =
    '90,77,104,55,62,58,94,45,91,75,43,66,126,128,100,210,83,187,43,56,101,65,103,90,68,136,91,75,122,14,116,48,98,186,17'
  t.equal(
    doc
      .sentences('string')
      .map((p) => p.text().length)
      .join(','),
    expected,
    'the sentences in the wiki text'
  )
  t.end()
})
//sentence
test('sentence - get - should return the first sentence', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'statoil.txt'), 'utf-8')
  let doc = wtf(str)
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
  let doc = wtf('', { images: ['Q42'] })
  t.deepEqual(doc.images(), [], 'the images equals []')
  t.end()
})

test('images - get - if the clue is a undefined / unset return the list of images', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [82, 89]
  t.deepEqual(
    doc.images().map((p) => p.url().length),
    expected,
    'the images in the wiki text'
  )
  t.end()
})

test('images - get - if the clue is a number return the images at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  t.equal(JSON.stringify(doc.image(1).url().length), '89', 'the images at index 1')
  t.end()
})

test('images - get - if the clue is a string (not number) return all the images', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [82, 89]
  t.deepEqual(
    doc.images('string').map((p) => p.url().length),
    expected,
    'the images in the wiki text'
  )
  t.end()
})

test('images - get - also get images from galeries', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Goryeo-ware.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [137, 67, 137, 222, 120]
  t.deepEqual(
    doc.images('string').map((p) => p.url().length),
    expected,
    'the images in the wiki text'
  )
  t.end()
})

//image
test('image - get - return the first image on the page', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(doc.image().url().length, 82, 'the first image on the page')
  t.end()
})

//links
test('links - get - return all links on the page', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [41, 71, 82, 94, 38, 40, 110, 40]
  t.deepEqual(
    doc.links().map((l) => JSON.stringify(l.json()).length),
    expected,
    'returns all links'
  )
  t.end()
})

test('links - get - if the clue is a number return the link at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(JSON.stringify(doc.link(1).json()).length, 71, 'the link at index 1')
  t.end()
})

test('links - get - if the clue is a string return the link with that content', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(
    JSON.stringify(doc.links('Jace Rocker')[0].json()).length,
    40,
    "the link at index the content 'Jace Rocker'"
  )
  t.end()
})

test('links - get - if the clue is any other type then return all links', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [41, 71, 82, 94, 38, 40, 110, 40]
  t.deepEqual(
    doc.links([]).map((l) => JSON.stringify(l.json()).length),
    expected,
    'returns all links'
  )
  t.end()
})

//interwiki
test('interwiki - get - return all interwiki on the page', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [82, 94]
  t.deepEqual(
    doc.interwiki().map((l) => JSON.stringify(l.json()).length),
    expected,
    'returns all interwiki'
  )
  t.end()
})

test('interwiki - get - if the clue is a number return the interwiki at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(JSON.stringify(doc.interwiki()[1].json()).length, 94, 'the interwiki at index 1')
  t.end()
})

test('interwiki - get - if the clue is any other type then return all interwiki', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Britt-Morgan.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [82, 94]
  t.deepEqual(
    doc.interwiki([]).map((l) => JSON.stringify(l.json()).length),
    expected,
    'returns all interwiki'
  )
  t.end()
})

//lists
test('lists - get - return all lists on the page', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'anarchism.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [1946, 815, 4911, 197, 2290, 428]
  t.deepEqual(
    doc.lists().map((l) => JSON.stringify(l.json()).length),
    expected,
    'returns all lists'
  )
  t.end()
})

test('lists - get - if the clue is a number return the lists at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'anarchism.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(JSON.stringify(doc.list(1).json()).length, 815, 'the lists at index 1')
  t.end()
})

test('lists - get - if the clue is any other type then return all lists', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'anarchism.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [1946, 815, 4911, 197, 2290, 428]
  t.deepEqual(
    doc.lists('string').map((l) => JSON.stringify(l.json()).length),
    expected,
    'returns all lists'
  )
  t.end()
})
//tables
// test('tables - get - return all tables', (t) => {
//   let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
//   let doc = wtf(str)
//   const expected = [1638, 783]
//   t.deepEqual(
//     doc.tables().map((l) => JSON.stringify(l.json()).length),
//     expected,
//     'returns all tables'
//   )
//   t.end()
// })

test('tables - get - if the clue is a number return the tables at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(JSON.stringify(doc.tables()[1].json()).length, 783, 'the tables at index 1')
  t.end()
})

// test('tables - get - if the clue is any other type then return all tables', (t) => {
//   let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
//   let doc = wtf(str)
//   const expected = [1638, 783]
//   t.deepEqual(
//     doc.tables('string').map((l) => JSON.stringify(l.json()).length),
//     expected,
//     'returns all tables'
//   )
//   t.end()
// })

//templates
test('templates - get - return all templates', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [13, 12, 5, 4, 4, 7, 7, 18]
  t.deepEqual(
    doc.templates().map((te) => te.json().template.length),
    expected,
    'returns all templates'
  )
  t.end()
})

test('templates - get - if the clue is a number return the templates at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  //I used the length of the paragraphs as an analogue for the content.
  t.deepEqual(doc.template(1).json().template.length, 12, 'the templates at index 1')
  t.end()
})

test('templates - get - if the clue is any other type then return all templates', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [13, 12, 5, 4, 4, 7, 7, 18]
  t.deepEqual(
    doc.templates().map((te) => te.json().template.length),
    expected,
    'returns all templates'
  )
  t.end()
})

//references -- same as citations
test('references - get - return all templates', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = '19,3,33,32,44,0,0,0,0,0,0,0,31,0,0,0,0,31,71,0,0,0,0,0,0,0,13,13,0,0,10,0,0,0'
  t.equal(
    doc
      .references()
      .map((r) => r.title().length)
      .join(','),
    expected,
    'returns all references'
  )
  t.end()
})

test('references - get - if the clue is a number return the references at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(doc.reference(1).title().length, 3, 'the references at index 1')
  t.end()
})

test('references - get - if the clue is any other type then return all references', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = '19,3,33,32,44,0,0,0,0,0,0,0,31,0,0,0,0,31,71,0,0,0,0,0,0,0,13,13,0,0,10,0,0,0'
  t.deepEqual(
    doc
      .references('string')
      .map((re) => re.title().length)
      .join(','),
    expected,
    'returns all references'
  )
  t.end()
})

//citations -- same as references
test('citations - get - return all templates', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = '19,3,33,32,44,0,0,0,0,0,0,0,31,0,0,0,0,31,71,0,0,0,0,0,0,0,13,13,0,0,10,0,0,0'
  t.equal(
    doc
      .citations()
      .map((c) => c.title().length)
      .join(','),
    expected,
    'returns all citations'
  )
  t.end()
})

test('citations - get - if the clue is a number return the citations at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  t.deepEqual(doc.citation(1).title().length, 3, 'the citations at index 1')
  t.end()
})

test('citations - get - if the clue is any other type then return all references', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Arts_Club_of_Chicago.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = '19,3,33,32,44,0,0,0,0,0,0,0,31,0,0,0,0,31,71,0,0,0,0,0,0,0,13,13,0,0,10,0,0,0'
  t.equal(
    doc
      .citations('string')
      .map((ci) => ci.title().length)
      .join(','),
    expected,
    'returns all citations'
  )
  t.end()
})

//coordinates
test('coordinates - get - return all coordinates', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Dollar-Point,-California.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [
    {
      display: 'inline,title',
      template: 'coord',
      props: { region: 'US_type:city' },
      lat: 39.18861,
      lon: -120.10889,
    },
    {
      template: 'coord',
      props: { type: 'city' },
      lat: 39.18861,
      lon: -120.10889,
    },
  ]
  t.deepEqual(doc.coordinates(), expected, 'returns all coordinates')
  t.end()
})

test('coordinates - get - if the clue is a number return the coordinates at that index', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Dollar-Point,-California.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = {
    template: 'coord',
    props: { type: 'city' },
    lat: 39.18861,
    lon: -120.10889,
  }
  t.deepEqual(doc.coordinate(1), expected, 'the coordinates at index 1')
  t.end()
})

test('coordinates - get - if the clue is any other type then return all coordinates', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Dollar-Point,-California.txt'), 'utf-8')
  let doc = wtf(str)
  const expected = [
    {
      display: 'inline,title',
      template: 'coord',
      props: { region: 'US_type:city' },
      lat: 39.18861,
      lon: -120.10889,
    },
    {
      template: 'coord',
      props: { type: 'city' },
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

test('infoboxes - get - return all templates', (t) => {
  let doc = wtf(infoboxPage)
  const expected = [201, 201, 89]
  t.deepEqual(
    doc.infoboxes().map((i) => JSON.stringify(i.json()).length),
    expected,
    'returns all templates in the infobox'
  )
  t.end()
})

test('infoboxes - get - if the clue is a number return the infoboxes at that index', (t) => {
  let doc = wtf(infoboxPage)
  t.deepEqual(JSON.stringify(doc.infobox(1).json()).length, 201, 'the infoboxes at index 1')
  t.end()
})

test('infoboxes - get - if the clue is any other type then return all references', (t) => {
  let doc = wtf(infoboxPage)
  const expected = []
  t.deepEqual(
    doc.infoboxes('string').map((info) => JSON.stringify(info.json()).length),
    expected,
    'returns all infoboxes'
  )
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

//json
test('json - get - get the json version of the document', (t) => {
  let str = fs.readFileSync(path.join(dir, '../', 'cache', 'Remote-Data-Services.txt'), 'utf-8')
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
