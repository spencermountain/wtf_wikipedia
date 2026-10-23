import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Groot-Brittanje', (t) => {
  const doc = wtf(readPage('Groot-Brittanje'))
  t.ok(
    doc.links().some((link) => link.page() === 'Verenigde Koninkryk'),
    'Groot-Brittanje: Afrikaans UK link'
  )
  t.match(doc.text(), /Groot-Brittanje/, 'Groot-Brittanje: Afrikaans island name')
  t.equal(doc.infobox().get('naam').text, 'Groot-Brittanje', 'Groot-Brittanje: Afrikaans island name field')
  t.ok(
    doc.links().some((link) => link.page() === 'Koninkryk van Groot-Brittanje'),
    'Groot-Brittanje: historical kingdom link'
  )
  t.ok(doc.categories().length > 0, 'Groot-Brittanje: Afrikaans categories are recognized')
  t.ok(doc.section('Staatkundige gebiede geassosieer met Groot-Brittanje'), 'Groot-Brittanje: Staatkundige gebiede geassosieer met Groot-Brittanje section')
  t.ok(doc.links().some((link) => link.page() === 'Europa'), 'Groot-Brittanje: European location link')
  t.end()
})

test('Mark-Behr', (t) => {
  const doc = wtf(readPage('Mark-Behr'))
  t.equal(doc.infobox().get('naam').text, 'Mark Behr', 'Mark-Behr: Afrikaans name field')
  t.equal(doc.infobox().get('geboortenaam').text, 'Mark Carl Behr', 'Mark-Behr: Afrikaans birth name field')
  t.match(doc.text(), /Afrikaans/, 'Mark-Behr: writing language')
  t.ok(
    doc.links().some((link) => link.page() === '19 Oktober'),
    'Mark-Behr: birth date link'
  )
  t.ok(doc.references().length > 0, 'Mark-Behr: biographical references')
  t.ok(doc.infoboxes().some((box) => box.get('beroep').text === 'Skrywer, akademikus'), 'Mark-Behr: beroep field')
  t.ok(doc.categories().includes('Suid-Afrikaanse skrywers'), 'Mark-Behr: Suid-Afrikaanse skrywers category')
  t.end()
})

/* TODO: Restore after references in section headings are handled.
test('Mark-Behr-Structure', (t) => {
  const doc = wtf(readPage('Mark-Behr'))
  t.equal(doc.isRedirect(), false, 'Mark-Behr: not-redirect')
  t.equal(doc.infoboxes().length, 1, 'Mark-Behr: got infobox')
  t.equal(doc.categories().length, 3, 'Mark-Behr: cat-length')
  let s = doc.section('publikasies')
  t.equal(s.tables().length, 1, 'Mark-Behr: got table')
  t.equal(doc.tables()[0].links().length, 0, 'Mark-Behr: table has no links')
  t.equal(s.lists().length, 0, 'Mark-Behr: no list')
  s = doc.section('toekennings')
  t.equal(s.lists().length, 1, 'Mark-Behr: got list')
  t.equal(s.lists()[0].lines().length, 4, 'Mark-Behr: got 4 items in list')
  t.end()
})
*/
