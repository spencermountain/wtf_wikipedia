import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('The-Starry-Night-Vi', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Vi'))
  t.equal(doc.infobox().get('title').text(), 'Đêm đầy sao', 'The-Starry-Night-Vi: Vietnamese painting title')
  t.equal(doc.infobox().get('year').text(), '1889', 'The-Starry-Night-Vi: year of creation')
  t.ok(doc.links().some((link) => link.page() === 'Museum of Modern Art'), 'The-Starry-Night-Vi: museum collection link')
  t.ok(doc.section('Nguồn gốc'), 'The-Starry-Night-Vi: origins section')
  t.ok(doc.references().length > 0, 'The-Starry-Night-Vi: painting history sources')
  t.ok(doc.infoboxes().some((box) => box.get('accession').text() === '472,1941'), 'The-Starry-Night-Vi: accession field')
  t.ok(doc.links().some((link) => link.page() === 'hậu ấn tượng'), 'The-Starry-Night-Vi: hậu ấn tượng link')
  t.end()
})

test('Toronto-Vi', (t) => {
  const doc = wtf(readPage('Toronto-Vi'))
  t.equal(doc.infobox().get('official_name').text(), 'City of Toronto', 'Toronto-Vi: official city name')
  t.ok(doc.links().some((link) => link.page() === 'Ontario'), 'Toronto-Vi: province link')
  t.ok(doc.section('Lịch sử'), 'Toronto-Vi: Vietnamese history heading')
  t.ok(doc.tables().length > 0, 'Toronto-Vi: city data table')
  t.ok(doc.references().length > 0, 'Toronto-Vi: city sources')
  t.ok(doc.references().some((reference) => reference.wikitext().includes('American Heritage Dictionary')), 'Toronto-Vi: pronunciation source')
  t.ok(doc.section('Tên gọi'), 'Toronto-Vi: Tên gọi section')
  t.end()
})
