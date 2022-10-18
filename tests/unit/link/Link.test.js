import test from 'tape'
import wtf from '../../lib/index.js'

// text
// get
test('text - should return the text of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.text(), 'wikipedia')
    t.end()
})

test('text - should return the text of a link with a pipe', (t) => {
    let doc = wtf(`[[wikipedia|wp]]`)
    let link = doc.links(0)[0]
    t.equal(link.text(), 'wp')
    t.end()
})

test('text - should return the text of a link with a pipe and a hash', (t) => {
    let doc = wtf(`[[wikipedia|wp#section]]`)
    let link = doc.links(0)[0]
    t.equal(link.text(), 'wp#section')
    t.end()
})

// WRONGLY PASSING
// test('text - should return the text of a link with a hash', (t) => {
//     let doc = wtf(`[[wikipedia#section]]`)
//     let link = doc.links(0)[0]
//     t.equal(link.text(), 'wikipedia#section')
//     t.end()
// })

test('text - should return the text without bold or italics', (t) => {
    let doc = wtf(`[[wikipedia|'''wp''']]`)
    let link = doc.links(0)[0]
    t.equal(link.text(), 'wp')

    doc = wtf(`[[wikipedia|''wp'']]`)
    link = doc.links(0)[0]
    t.equal(link.text(), 'wp')
    t.end()
})

// WRONGLY PASSING
test('text - should return the text for a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.equal(link.text(), '')
    t.end()
})

test('text - should return the text for a external link with a pipe', (t) => {
    let doc = wtf(`[http://wikipedia.org wikipedia]`)
    let link = doc.links(0)[0]
    t.equal(link.text(), 'wikipedia')
    t.end()
})

test('text - should return the text for a interwiki link', (t) => {
    let doc = wtf(`[[wikipedia:cool]]`)
    let link = doc.links(0)[0]
    t.equal(link.text(), 'cool')
    t.end()
})

// set

test('text - providing a string should set the text of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    link.text('wp')
    t.equal(link.text(), 'wp')
    t.end()
})

test('text - providing a string should set the text of a link with a pipe', (t) => {
    let doc = wtf(`[[wikipedia|wp]]`)
    let link = doc.links(0)[0]
    link.text('wikipedia')
    t.equal(link.text(), 'wikipedia')
    t.end()
})


// json 
// get
test('json - should return the json of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    t.deepEqual(link.json(), {
        page: 'wikipedia',
        text: 'wikipedia',
        type: 'internal'
    })
    t.end()
})

test('json - should return the json of a link with a hash', (t) => {
    let doc = wtf(`[[wikipedia#section]]`)
    let link = doc.links(0)[0]
    t.deepEqual(link.json(), {
        text: 'wikipedia',
        type: 'internal',
        page: 'wikipedia',
        anchor: 'section'
    })
    t.end()
})

test('json - should return the json of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.deepEqual(link.json(), {
        text: '',
        type: 'external',
        site: 'http://wikipedia.org'
    })
    t.end()
})

// wikitext
// get
test('wikitext - should return the wikitext of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.wikitext(), '[[wikipedia]]')
    t.end()
})

test('wikitext - should return the wikitext of a link with a hash', (t) => {
    let doc = wtf(`[[wikipedia#section]]`)
    let link = doc.links(0)[0]
    t.equal(link.wikitext(), '[[wikipedia#section]]')
    t.end()
})

test('wikitext - should return the wikitext of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.equal(link.wikitext(), '[http://wikipedia.org]')
    t.end()
})

test('wikitext - should return the wikitext of a interwiki link', (t) => {
    let doc = wtf(`[[fr:wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.wikitext(), '[[fr:wikipedia]]')
    t.end()
})

// page
// get
test('page - should return the page of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.page(), 'wikipedia')
    t.end()
})

test('page - should return the page of a link with a hash', (t) => {
    let doc = wtf(`[[wikipedia#section]]`)
    let link = doc.links(0)[0]
    t.equal(link.page(), 'wikipedia')
    t.end()
})

test('page - should return the page of a link with a pipe', (t) => {
    let doc = wtf(`[[wikipedia|wp]]`)
    let link = doc.links(0)[0]
    t.equal(link.page(), 'wikipedia')
    t.end()
})

test('page - should return the page of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.equal(link.page(), undefined)
    t.end()
})

test('page - should return the page of a interwiki link', (t) => {
    let doc = wtf(`[[fr:wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.page(), 'wikipedia')
    t.end()
})

// set
test('page - providing a string should set the page of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    link.page('wp')
    t.equal(link.page(), 'wp')
    t.end()
})

test('page - providing a string should set the page of a link with a hash', (t) => {
    let doc = wtf(`[[wikipedia#section]]`)
    let link = doc.links(0)[0]
    link.page('wp')
    t.equal(link.page(), 'wp')
    t.end()
})

test('page - providing a string should set the page of a link with a pipe', (t) => {
    let doc = wtf(`[[wikipedia|wp]]`)
    let link = doc.links(0)[0]
    link.page('wp')
    t.equal(link.page(), 'wp')
    t.end()
})

// anchor
// get
test('anchor - should return the anchor of a link', (t) => {
    let doc = wtf(`[[wikipedia#section]]`)
    let link = doc.links(0)[0]
    t.equal(link.anchor(), 'section')
    t.end()
})

test('anchor - should return the anchor of a link with a pipe', (t) => {
    let doc = wtf(`[[wikipedia#section|wp]]`)
    let link = doc.links(0)[0]
    t.equal(link.anchor(), 'section')
    t.end()
})

// WRONGLY PASSING
test('anchor - should return the anchor of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.equal(link.anchor(), '')
    t.end()
})

test('anchor - should return the anchor of a interwiki link', (t) => {
    let doc = wtf(`[[fr:wikipedia#section]]`)
    let link = doc.links(0)[0]
    t.equal(link.anchor(), 'section')
    t.end()
})

// set
test('anchor - should set the anchor of a link', (t) => {
    let doc = wtf(`[[wikipedia#section]]`)
    let link = doc.links(0)[0]
    link.anchor('section2')
    t.equal(link.anchor(), 'section2')
    t.end()
})

test('anchor - should set the anchor of a link with a pipe', (t) => {
    let doc = wtf(`[[wikipedia#section|wp]]`)
    let link = doc.links(0)[0]
    link.anchor('section2')
    t.equal(link.anchor(), 'section2')
    t.end()
})

// wiki
// get
test('wiki - should return the wiki of a link', (t) => {
    let doc = wtf(`[[fr:wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.wiki(), 'fr')
    t.end()
})

test('wiki - should return the wiki of a link with a hash', (t) => {
    let doc = wtf(`[[fr:wikipedia#section]]`)
    let link = doc.links(0)[0]
    t.equal(link.wiki(), 'fr')
    t.end()
})

test('wiki - should return the wiki of a link with a pipe', (t) => {
    let doc = wtf(`[[fr:wikipedia|wp]]`)
    let link = doc.links(0)[0]
    t.equal(link.wiki(), 'fr')
    t.end()
})

// set
test('wiki - should set the wiki of a link', (t) => {
    let doc = wtf(`[[fr:wikipedia]]`)
    let link = doc.links(0)[0]
    link.wiki('en')
    t.equal(link.wiki(), 'en')
    t.end()
})

// type
// get
test('type - should return the type of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.type(), 'internal')
    t.end()
})

test('type - should return the type of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.equal(link.type(), 'external')
    t.end()
})

test('type - should return the type of a interwiki link', (t) => {
    let doc = wtf(`[[fr:wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.type(), 'interwiki')
    t.end()
})

// set
test('type - should set the type of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    link.type('external')
    t.equal(link.type(), 'external')
    t.end()
})

// site
// get
test('site - should return the site of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.site(), undefined)
    t.end()
})

test('site - should return the site of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.equal(link.site(), 'http://wikipedia.org')
    t.end()
})

test('site - should return the site of a interwiki link', (t) => {
    let doc = wtf(`[[fr:wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.site(), undefined)
    t.end()
})

test('site - should return the site of a external link with a path', (t) => {
    let doc = wtf(`[http://wikipedia.org/path]`)
    let link = doc.links(0)[0]
    t.equal(link.site(), 'http://wikipedia.org/path')
    t.end()
})

// set

test('site - should set the site of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    link.site('http://wikipedia.org')
    t.equal(link.site(), 'http://wikipedia.org')
    t.end()
})

test('site - should set the site of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org/wiki/Hoofdpagina]`)
    let link = doc.links(0)[0]
    link.site('http://wikimedia.org')
    t.equal(link.site(), 'http://wikimedia.org')
    t.end()
})

// href 

// WRONGLY PASSING
test('href - should return the href of a link', (t) => {
    let doc = wtf(`[[wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.href(), './wikipedia')
    t.end()
})

test('href - should return the href of a link with a hash', (t) => {
    let doc = wtf(`[[wikipedia#section]]`)
    let link = doc.links(0)[0]
    t.equal(link.href(), './wikipedia#section')
    t.end()
})

test('href - should return the href of a link with a pipe', (t) => {
    let doc = wtf(`[[wikipedia|wp]]`)
    let link = doc.links(0)[0]
    t.equal(link.href(), './wikipedia')
    t.end()
})

test('href - should return the href of a external link', (t) => {
    let doc = wtf(`[http://wikipedia.org]`)
    let link = doc.links(0)[0]
    t.equal(link.href(), 'http://wikipedia.org')
    t.end()
})

test('href - should return the href of a interwiki link', (t) => {
    let doc = wtf(`[[fr:wikipedia]]`)
    let link = doc.links(0)[0]
    t.equal(link.href(), 'http://fr.wikipedia.org/wiki/wikipedia')
    t.end()
})

