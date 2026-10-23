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
  t.equal(doc.infobox().get('Name').text, 'BBDO Germany GmbH', 'BBDO: German company name')
  t.equal(doc.infobox().get('ISIN').text, 'nicht vorhanden', 'BBDO: stock identifier status')
  t.match(doc.text(), /Werbe- und Marketingagentur/, 'BBDO: German business description')
  t.ok(
    doc.infoboxes().some((box) => box.get('Gründungsdatum').text === '1956'),
    'BBDO: Gründungsdatum field'
  )
  t.ok(doc.categories().includes('Werbeagentur'), 'BBDO: Werbeagentur category')
  t.end()
})

test('Bazooka', (t) => {
  const doc = wtf(readPage('Bazooka'))
  t.equal(doc.title, 'Bazooka', 'Bazooka: weapon name')
  t.ok(
    doc.images().some((image) => /Bazookas[ _]Korea\.jpg$/.test(image.file())),
    'Bazooka: Korean War photograph'
  )
  t.match(doc.text(), /Antitank Rocket Launcher/, 'Bazooka: official weapon designation')
  t.ok(doc.sections().length > 1, 'Bazooka: weapon history is sectioned')
  t.ok(doc.references().length > 0, 'Bazooka: historical sources')
  t.ok(doc.categories().includes('Panzerabwehrrakete'), 'Bazooka: Panzerabwehrrakete category')
  t.ok(
    doc.links().some((link) => link.page() === 'Reaktive Panzerbüchse'),
    'Bazooka: reaktive Panzerbüchse link'
  )
  t.end()
})

test('HMS-Irresistible', (t) => {
  const doc = wtf(readPage('HMS-Irresistible'))
  t.equal(doc.title, 'HMS Irresistible', 'HMS-Irresistible: ship name')
  t.ok(
    doc.links().some((link) => link.page() === 'Royal Navy'),
    'HMS-Irresistible: navy link'
  )
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
  t.ok(
    doc.images().some((image) => /Keilprofil-6K-Detail\.JPG$/.test(image.file())),
    'Keilwelle: shaft profile detail illustration'
  )
  t.equal(doc.title, 'Keilwellen', 'Keilwelle: mechanical component name')
  t.match(doc.text(), /Welle/, 'Keilwelle: shaft description')
  t.ok(doc.categories().length > 0, 'Keilwelle: engineering categories')
  t.ok(doc.section('Keilwellen-Verbindungen'), 'Keilwelle: Keilwellen-Verbindungen section')
  t.ok(doc.categories().includes('Bauform (Welle)'), 'Keilwelle: Bauform (Welle) category')
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
    doc.tables()[0].rows().length > 0,
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

test('Maurische-Netzwuhle', (t) => {
  const doc = wtf(readPage('Maurische-Netzwuhle'))
  t.match(doc.text(), /Blanus cinereus/, 'Maurische-Netzwuhle: scientific species name')
  t.equal(doc.title, 'Maurische Netzwühle', 'Maurische-Netzwuhle: German species name')
  t.equal(
    doc.infobox().get('Taxon_WissName').text,
    'Blanus cinereus',
    'Maurische-Netzwuhle: taxonomic scientific name field'
  )
  t.equal(doc.infobox().get('Taxon_Rang').text, 'Art', 'Maurische-Netzwuhle: species taxonomic rank')
  t.ok(doc.categories().length > 0, 'Maurische-Netzwuhle: species categories')
  t.ok(doc.categories().includes('Doppelschleichen'), 'Maurische-Netzwuhle: Doppelschleichen category')
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
})

test('Sara-C-Bisel', (t) => {
  const doc = wtf(readPage('Sara-C-Bisel'))
  t.equal(doc.title, 'Sara C. Bisel', 'Sara-C-Bisel: archaeologist name')
  t.ok(
    doc.links().some((link) => link.page() === 'Archäologie'),
    'Sara-C-Bisel: German archaeology link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Johnstown (Pennsylvania)'),
    'Sara-C-Bisel: birthplace link'
  )
  t.match(doc.text(), /Sara Louise Clark/, 'Sara-C-Bisel: birth name')
  t.match(doc.text(), /1932/, 'Sara-C-Bisel: birth year')
  t.ok(doc.section('Leben'), 'Sara-C-Bisel: Leben section')
  t.match(doc.text(), /Carnegie Mellon University/, 'Sara-C-Bisel: university education')
  t.end()
})

test('Wendy-Mogel', (t) => {
  const doc = wtf(readPage('Wendy-Mogel'))
  t.equal(doc.title, 'Wendy Mogel', 'Wendy-Mogel: psychologist name')
  t.ok(
    doc.links().some((link) => link.page() === 'Klinische Psychologie'),
    'Wendy-Mogel: German clinical psychology link'
  )
  t.match(doc.text(), /1951/, 'Wendy-Mogel: birth year')
  t.match(doc.text(), /2001/, 'Wendy-Mogel: book publication year')
  t.ok(doc.references().length > 0, 'Wendy-Mogel: biographical sources')
  t.match(doc.text(), /Michael Tolkin/, 'Wendy-Mogel: husband named in biography')
  t.ok(doc.categories().includes('Klinischer Psychologe'), 'Wendy-Mogel: Klinischer Psychologe category')
  t.end()
})
