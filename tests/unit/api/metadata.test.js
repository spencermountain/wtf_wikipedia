import test from 'tape'
import wtf from '../../lib/index.js'

test('null page metadata', (t) => {
  const doc = wtf('oh yeah')
  t.equal(doc.revisionID, null, 'missing revision ID')
  t.equal(doc.pageID, null, 'missing page ID')
  t.equal(doc.description, null, 'missing description')
  t.equal(doc.timestamp, null, 'missing timestamp')
  t.equal(doc.pageImage, null, 'missing image filename')
  t.end()
})

test('found page metadata', (t) => {
  const meta = {
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
  const doc = wtf('oh yeah', meta)
  t.equal(doc.revisionID, meta.revisionID, 'revision ID')
  t.equal(doc.pageID, meta.pageID, 'page ID')
  t.equal(doc.namespace, meta.namespace, 'namespace')
  t.equal(doc.description, meta.description, 'description')
  t.equal(doc.timestamp, meta.timestamp, 'timestamp')
  t.equal(doc.images()[0].file(), meta.pageImage, 'image filename')
  t.equal(doc.domain, meta.domain, 'domain')
  t.equal(doc.wikidata, meta.wikidata, 'Wikidata ID')
  t.equal(doc.language, meta.lang, 'language')

  doc.revisionID = 'foo'
  doc.pageID = 'foo'
  doc.description = 'foo'
  doc.timestamp = 'foo'
  doc.pageImage = 'foo'
  doc.domain = 'foo'
  doc.wikidata = 'foo'
  doc.language = 'foo'
  t.notEqual(doc.revisionID, meta.revisionID, 'updated revision ID')
  t.notEqual(doc.pageID, meta.pageID, 'updated page ID')
  t.notEqual(doc.description, meta.description, 'updated description')
  t.notEqual(doc.timestamp, meta.timestamp, 'updated timestamp')
  t.notEqual(doc.pageImage, meta.pageImage, 'updated image filename')
  t.notEqual(doc.domain, meta.domain, 'updated domain')
  t.notEqual(doc.wikidata, meta.wikidata, 'updated Wikidata ID')
  t.notEqual(doc.language, meta.wikidata, 'updated language')

  t.end()
})

test('namespace zero survives initialization, aliases, and updates', (t) => {
  t.equal(wtf('', { namespace: 0, ns: 1 }).namespace, 0, 'explicit zero wins over alias')
  t.equal(wtf('', { ns: 0 }).ns, 0, 'numeric alias is preserved')
  const doc = wtf('', { namespace: 'talk' })
  t.equal((doc.namespace = 0), 0, 'setter returns zero')
  t.equal(wtf('').namespace, null, 'missing namespace remains null')
  t.end()
})
