import test from 'tape'
import wtf from '../../lib/index.js'

test('named link lookup skips external links', (t) => {
  const doc = wtf('[https://example.com source] [[Target|first]] [[Target|second]]')
  const section = doc.section()

  t.equal(doc.links().some((link) => link.type() === 'external'), true, 'external link is retained')
  t.equal(doc.links('target')[0].page(), 'Target', 'document lookup ignores case')
  t.equal(doc.links('TARGET')[0].text(), 'first', 'document lookup keeps the first match')
  t.equal(section.links('target')[0].page(), 'Target', 'section lookup ignores case')
  t.equal(section.links('TARGET')[0].text(), 'first', 'section lookup keeps the first match')
  t.deepEqual(doc.links('Missing'), [], 'missing document target returns no matches')
  t.deepEqual(section.links('Missing'), [], 'missing section target returns no matches')
  t.end()
})

test('named link lookup handles sections containing only external links', (t) => {
  const doc = wtf('[https://example.com source]')
  t.deepEqual(doc.links('Missing'), [], 'document lookup returns no matches')
  t.deepEqual(doc.section().links('Missing'), [], 'section lookup returns no matches')
  t.end()
})
