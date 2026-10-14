import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Groot-Brittanje', (t) => {
  const doc = wtf(readPage('Groot-Brittanje'))
  t.ok(doc.links().some((link) => link.page() === 'Verenigde Koninkryk'), 'Afrikaans UK link')
  t.match(doc.text(), /Groot-Brittanje/, 'Afrikaans island name')
  t.equal(doc.infobox().get('naam').text(), 'Groot-Brittanje', 'Afrikaans island name field')
  t.ok(doc.links().some((link) => link.page() === 'Koninkryk van Groot-Brittanje'), 'historical kingdom link')
  t.ok(doc.categories().length > 0, 'Afrikaans categories are recognized')
  t.end()
})

test('Mark-Behr', (t) => {
  const doc = wtf(readPage('Mark-Behr'))
  t.equal(doc.infobox().get('naam').text(), 'Mark Behr', 'Afrikaans name field')
  t.equal(doc.infobox().get('geboortenaam').text(), 'Mark Carl Behr', 'Afrikaans birth name field')
  t.match(doc.text(), /Afrikaans/, 'writing language')
  t.ok(doc.links().some((link) => link.page() === '19 Oktober'), 'birth date link')
  t.ok(doc.references().length > 0, 'biographical references')
  t.end()
})

test('Mark-Behr-Structure', (t) => {
  const doc = wtf(readPage('Mark-Behr'))
  t.equal(doc.isRedirect(), false, 'not-redirect')
  t.equal(doc.infoboxes().length, 1, 'got infobox')
  t.equal(doc.categories().length, 3, 'cat-length')
  let s = doc.section('publikasies')
  t.equal(s.tables().length, 1, 'got table')
  t.equal(doc.table().links().length, 0, 'table has no links')
  t.equal(s.lists().length, 0, 'no list')
  s = doc.section('toekennings')
  t.equal(s.lists().length, 1, 'got list')
  t.equal(s.list().lines().length, 4, 'got 4 items in list')
  t.end()
})
