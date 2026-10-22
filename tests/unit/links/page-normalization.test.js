import test from 'tape'
import wtf from '../../lib/index.js'

test('link page titles are normalized independently of text', (t) => {
  const examples = [
    ['[[paris]]', 'Paris', 'paris'],
    ['[[new York]]', 'New York', 'new York'],
    ['[[new york]]', 'New york', 'new york'],
    ['[[new_York|the city]]', 'New York', 'the city'],
    ['[[  new__York  |city]]', 'New York', 'city'],
    ['[[café]]', 'Café', 'café'],
    ['[[cafe\u0301|coffee]]', 'Café', 'coffee'],
    ['[[iPhone]]', 'IPhone', 'iPhone'],
    ['[[help:contents|help]]', 'Help:Contents', 'help'],
    ['[[star trek: discovery]]', 'Star trek: discovery', 'star trek: discovery'],
    ['[[:fr:paris]]', 'Paris', 'fr:paris'],
    ['[[fr:paris]]', 'Paris', ''],
    ['[[wiktionary:fr:bonjour]]', 'bonjour', 'wiktionary:fr:bonjour'],
    ['[[doi:abc/def]]', 'abc/def', 'doi:abc/def'],
    ['[[paris#history|history]]', 'Paris', 'history'],
  ]
  examples.forEach(([wiki, page, text]) => {
    const doc = wtf(wiki)
    const link = doc.links()[0]
    t.equal(link.page(), page, `${wiki} page`)
    t.equal(link.json().page, page, `${wiki} JSON page`)
    t.equal(link.text(), text, `${wiki} text`)
    t.equal(doc.text(), text, `${wiki} document text`)
  })
  t.end()
})

test('link URLs encode normalized titles once', (t) => {
  t.equal(wtf('[[new York]]').links()[0].href(), './New_York', 'spaces become underscores in URLs')
  t.equal(wtf('[[café]]').links()[0].href(), './Caf%C3%A9', 'Unicode is encoded only in URLs')
  t.equal(wtf('[[100% pure]]').links()[0].href(), './100%25_pure', 'literal percent is encoded once')
  t.equal(wtf('[[paris#history]]').links()[0].anchor(), 'history', 'fragment case is preserved')
  t.end()
})
