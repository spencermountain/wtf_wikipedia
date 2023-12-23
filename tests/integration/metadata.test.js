import test from 'tape'
import wtf from '../lib/index.js'

test('null page metadata', (t) => {
  let doc = wtf('oh yeah')
  t.equal(doc.revisionID(), null)
  t.equal(doc.pageID(), null)
  t.equal(doc.description(), null)
  t.equal(doc.timestamp(), null)
  t.equal(doc.pageImage(), null)

  t.end()
})

test('found page metadata', (t) => {
  let meta = {
    lang: 'en',
    wiki: 'wikipedia',
    domain: 'wikipedia.org',
    follow_redirects: true,
    path: 'api.php',
    title: 'Grand Bend',
    pageID: 865444,
    namespace: 0,
    revisionID: 1174940601,
    timestamp: '2023-09-11T18:28:45Z',
    pageImage: 'Grand_Bend_2.JPG',
    wikidata: 'Q1542518',
    description: 'Place in Ontario, Canada',
  }
  let doc = wtf('oh yeah', meta)
  t.equal(doc.revisionID(), meta.revisionID)
  t.equal(doc.pageID(), meta.pageID)
  t.equal(doc.description(), meta.description)
  t.equal(doc.timestamp(), meta.timestamp)
  t.equal(doc.pageImage(), meta.pageImage)
  t.equal(doc.domain(), meta.domain)
  t.equal(doc.wikidata(), meta.wikidata)

  t.end()
})
