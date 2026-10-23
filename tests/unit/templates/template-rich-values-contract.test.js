import test from 'tape'
import wtf from '../../lib/index.js'

test('ordinary template arguments simplify rich text', (t) => {
  const result = wtf("{{ContractRich|caption=''italic'' and [[Target page|label]]|url=https://example.com/?a=b|empty=}}").template().json()
  t.equal(result.data.caption, 'italic and label', 'formatting and link labels become readable text')
  t.equal(result.data.url, 'https://example.com/?a=b', 'equals signs inside values survive')
  // TODO: Preserve explicit empty arguments during cleanup.
  // t.equal(result.data.empty, '', 'explicit empty arguments survive')
  t.end()
})

test('infobox values retain rich text and links', (t) => {
  const box = wtf("{{Infobox person|name=Example|caption=''italic'' and [[Target page|label]]}}").infobox()
  t.equal(box.get('caption').text, 'italic and label', 'infobox values expose readable text')
  t.deepEqual(box.links().map((link) => link.page()), ['Target page'], 'infobox values retain link destinations')
  t.equal(box.json().template, 'Infobox person', 'infobox retains source template spelling')
  t.ok(box.json().data.caption, 'rich value lives inside envelope data')
  t.end()
})

test('references use the template envelope', (t) => {
  const reference = wtf('A claim.<ref>{{cite web|title=An [[Example|article]]|url=https://example.com/}}</ref>').references()[0]
  const result = reference.json()
  t.equal(result.template, 'cite web', 'reference retains the template name')
  t.equal(result.data.title, 'An article', 'citation arguments simplify rich text')
  t.equal(result.data.url, 'https://example.com/', 'citation fields live in data')
  t.end()
})
