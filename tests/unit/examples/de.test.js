import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('BBDO', (t) => {
  const doc = wtf(readPage('BBDO'))
  t.match(doc.text(), /BBDO/, 'BBDO: German article retains the company name')
  t.ok(
    doc.links().some((link) => link.page() === 'Gesellschaft mit beschränkter Haftung (Deutschland)'),
    'BBDO: company legal-form link'
  )
  t.equal(doc.infobox().get('Name').text(), 'BBDO Germany GmbH', 'BBDO: German company name')
  t.equal(doc.infobox().get('ISIN').text(), 'nicht vorhanden', 'BBDO: stock identifier status')
  t.match(doc.text(), /Werbe- und Marketingagentur/, 'BBDO: German business description')
  t.ok(
    doc.infoboxes().some((box) => box.get('Gründungsdatum').text() === '1956'),
    'BBDO: Gründungsdatum field'
  )
  t.ok(doc.categories().includes('Werbeagentur'), 'BBDO: Werbeagentur category')
  t.end()

  t.match(doc.text(), /Antitank Rocket Launcher/, 'Bazooka: official weapon designation')
  t.ok(doc.sections().length > 1, 'Bazooka: weapon history is sectioned')
  t.ok(doc.references().length > 0, 'Bazooka: historical sources')
  t.ok(doc.categories().includes('Panzerabwehrrakete'), 'Bazooka: Panzerabwehrrakete category')
  t.ok(
    doc.links().some((link) => link.page() === 'reaktive Panzerbüchse'),
    'Bazooka: reaktive Panzerbüchse link'
  )
  t.end()

  t.ok(doc.lists().length > 0, 'HMS-Irresistible: list of ships')
  t.match(doc.text(), /britischen/, 'HMS-Irresistible: British navy description')
  t.ok(
    doc.links().some((link) => link.page() === 'Vereinigtes Königreich'),
    'HMS-Irresistible: United Kingdom link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Englische Sprache'),
    'HMS-Irresistible: Englische Sprache link'
  )
  t.ok(doc.categories().includes('Schiffsname der Royal Navy'), 'HMS-Irresistible: Schiffsname der Royal Navy category')
  t.end()
})

test('Keilwelle', (t) => {
  const doc = wtf(readPage('Keilwelle'))
  t.ok(doc.images().length > 0, 'Keilwelle: technical illustrations')

  t.end()
})

test('Liste-Der-Argentinischen-Botschafter-In-Chile', (t) => {
  const doc = wtf(readPage('Liste-Der-Argentinischen-Botschafter-In-Chile'))
  t.ok(
    doc.tables().length > 0,
    'Liste-Der-Argentinischen-Botschafter-In-Chile: ambassador chronology is parsed as a table'
  )
  t.match(doc.text(), /Santiago/, 'Liste-Der-Argentinischen-Botschafter-In-Chile: embassy address')
  t.ok(
    doc.table().keyValue().length > 0,
    'Liste-Der-Argentinischen-Botschafter-In-Chile: ambassador table contains rows'
  )
  t.match(doc.text(), /Miraflores/, 'Liste-Der-Argentinischen-Botschafter-In-Chile: embassy street')
  t.ok(doc.categories().length > 0, 'Liste-Der-Argentinischen-Botschafter-In-Chile: diplomatic list categories')
  t.ok(
    doc.categories().includes('Liste (argentinische Botschafter)'),
    'Liste-Der-Argentinischen-Botschafter-In-Chile: Liste (argentinische Botschafter) category'
  )
  t.ok(
    doc.categories().includes('Liste (Diplomatisches Corps in Chile)'),
    'Liste-Der-Argentinischen-Botschafter-In-Chile: Liste (Diplomatisches Corps in Chile) category'
  )
  t.end()
})

  t.ok(
    doc.links().some((link) => link.page() === 'Doppelschleichen'),
    'Maurische-Netzwuhle: Doppelschleichen link'
  )
  t.end()
})

test('Mozilla-Firefox', (t) => {
  const doc = wtf(readPage('Mozilla-Firefox'))
  t.match(doc.text(), /Firefox/, 'Mozilla-Firefox: browser name')
  t.ok(
    doc.images().some((image) => /Firefox.*logo/i.test(image.file())),
    'Mozilla-Firefox: browser logo'
  )
  t.equal(doc.infobox().type(), 'software', 'Mozilla-Firefox: software infobox')
  t.ok(doc.section('Geschichte'), 'Mozilla-Firefox: German history section')
  t.ok(doc.references().length > 0, 'Mozilla-Firefox: software sources')
  t.ok(
    doc.links().some((link) => link.page() === 'Amerikanisches Englisch'),
    'Mozilla-Firefox: Amerikanisches Englisch link'
  )
  t.ok(doc.section('Name'), 'Mozilla-Firefox: Name section')
  t.end()

  t.ok(
    doc.links().some((link) => link.page() === 'Johnstown (Pennsylvania)'),
    'Sara-C-Bisel: birthplace link'
  )
  t.match(doc.text(), /Sara Louise Clark/, 'Sara-C-Bisel: birth name')
  t.match(doc.text(), /1932/, 'Sara-C-Bisel: birth year')
  t.ok(doc.section('Leben'), 'Sara-C-Bisel: Leben section')
  t.match(doc.text(), /Carnegie Mellon University/, 'Sara-C-Bisel: university education')
  t.end()

  t.match(doc.text(), /1951/, 'Wendy-Mogel: birth year')
  t.match(doc.text(), /2001/, 'Wendy-Mogel: book publication year')
  t.ok(doc.references().length > 0, 'Wendy-Mogel: biographical sources')
  t.match(doc.text(), /Michael Tolkin/, 'Wendy-Mogel: husband named in biography')
  t.ok(doc.categories().includes('Klinischer Psychologe'), 'Wendy-Mogel: Klinischer Psychologe category')
  t.end()
})
