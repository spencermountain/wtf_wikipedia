import test from 'tape'
import wtf from '../lib/index.js'

test('named link lookup skips external links', (t) => {
  const doc = wtf('[https://example.com source] [[Target|first]] [[Target|second]]')
  const section = doc.section()

  t.equal(doc.links().some((link) => link.type() === 'external'), true, 'external link is retained')
  t.equal(doc.links('target')[0].page(), 'Target', 'document lookup ignores case')
  t.deepEqual(doc.links('TARGET').map((link) => link.text()), ['first', 'second'], 'document lookup retains all matches in order')
  t.equal(section.links('target')[0].page(), 'Target', 'section lookup ignores case')
  t.deepEqual(section.links('TARGET').map((link) => link.text()), ['first', 'second'], 'section lookup retains all matches in order')
  t.ok(doc.links('Missing').isEmpty(), 'missing document target returns no matches')
  t.ok(section.links('Missing').isEmpty(), 'missing section target returns no matches')
  t.end()
})

test('named link lookup handles sections containing only external links', (t) => {
  const doc = wtf('[https://example.com source]')
  t.ok(doc.links('Missing').isEmpty(), 'document lookup returns no matches')
  t.ok(doc.section().links('Missing').isEmpty(), 'section lookup returns no matches')
  t.end()
})
