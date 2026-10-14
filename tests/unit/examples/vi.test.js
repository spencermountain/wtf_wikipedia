import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('The-Starry-Night-Vi', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Vi'))
  t.equal(doc.infobox().get('title').text(), 'Đêm đầy sao', 'Vietnamese painting title')
  t.equal(doc.infobox().get('year').text(), '1889', 'year of creation')
  t.ok(doc.links().some((link) => link.page() === 'Museum of Modern Art'), 'museum collection link')
  t.ok(doc.section('Nguồn gốc'), 'origins section')
  t.ok(doc.references().length > 0, 'painting history sources')
  t.end()
})

test('Toronto-Vi', (t) => {
  const doc = wtf(readPage('Toronto-Vi'))
  t.equal(doc.infobox().get('official_name').text(), 'City of Toronto', 'official city name')
  t.ok(doc.links().some((link) => link.page() === 'Ontario'), 'province link')
  t.ok(doc.section('Lịch sử'), 'Vietnamese history heading')
  t.ok(doc.tables().length > 0, 'city data table')
  t.ok(doc.references().length > 0, 'city sources')
  t.end()
})
