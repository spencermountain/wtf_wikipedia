import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('BBDO', (t) => {
  const doc = wtf(readPage('BBDO'))
  t.match(doc.text(), /BBDO/, 'German article retains the company name')
  t.ok(
    doc.links().some((link) => link.page() === 'Gesellschaft mit beschränkter Haftung (Deutschland)'),
    'company legal-form link'
  )
  t.equal(doc.infobox().get('Name').text(), 'BBDO Germany GmbH', 'German company name')
  t.equal(doc.infobox().get('ISIN').text(), 'nicht vorhanden', 'stock identifier status')
  t.match(doc.text(), /Werbe- und Marketingagentur/, 'German business description')
  t.end()
})

test('Bazooka', (t) => {
  const doc = wtf(readPage('Bazooka'))
  t.equal(doc.title(), 'Bazooka', 'weapon name')
  t.ok(
    doc.images().some((image) => /Bazookas[ _]Korea\.jpg$/.test(image.file())),
    'Korean War photograph'
  )
  t.match(doc.text(), /Antitank Rocket Launcher/, 'official weapon designation')
  t.ok(doc.sections().length > 1, 'weapon history is sectioned')
  t.ok(doc.references().length > 0, 'historical sources')
  t.end()
})

test('HMS-Irresistible', (t) => {
  const doc = wtf(readPage('HMS-Irresistible'))
  t.equal(doc.title(), 'HMS Irresistible', 'ship name')
  t.ok(
    doc.links().some((link) => link.page() === 'Royal Navy'),
    'navy link'
  )
  t.ok(doc.lists().length > 0, 'list of ships')
  t.match(doc.text(), /britischen/, 'British navy description')
  t.ok(
    doc.links().some((link) => link.page() === 'Vereinigtes Königreich'),
    'United Kingdom link'
  )
  t.end()
})

test('Keilwelle', (t) => {
  const doc = wtf(readPage('Keilwelle'))
  t.ok(doc.images().length > 0, 'technical illustrations')
  t.ok(
    doc.images().some((image) => /Keilprofil-6K-Detail\.JPG$/.test(image.file())),
    'shaft profile detail illustration'
  )
  t.equal(doc.title(), 'Keilwellen', 'mechanical component name')
  t.match(doc.text(), /Welle/, 'shaft description')
  t.ok(doc.categories().length > 0, 'engineering categories')
  t.end()
})

test('Liste-Der-Argentinischen-Botschafter-In-Chile', (t) => {
  const doc = wtf(readPage('Liste-Der-Argentinischen-Botschafter-In-Chile'))
  t.ok(doc.tables().length > 0, 'ambassador chronology is parsed as a table')
  t.match(doc.text(), /Santiago/, 'embassy address')
  t.ok(doc.table().keyValue().length > 0, 'ambassador table contains rows')
  t.match(doc.text(), /Miraflores/, 'embassy street')
  t.ok(doc.categories().length > 0, 'diplomatic list categories')
  t.end()
})

test('Maurische-Netzwuhle', (t) => {
  const doc = wtf(readPage('Maurische-Netzwuhle'))
  t.match(doc.text(), /Blanus cinereus/, 'scientific species name')
  t.equal(doc.title(), 'Maurische Netzwühle', 'German species name')
  t.equal(doc.infobox().get('Taxon_WissName').text(), 'Blanus cinereus', 'taxonomic scientific name field')
  t.equal(doc.infobox().get('Taxon_Rang').text(), 'Art', 'species taxonomic rank')
  t.ok(doc.categories().length > 0, 'species categories')
  t.end()
})

test('Mozilla-Firefox', (t) => {
  const doc = wtf(readPage('Mozilla-Firefox'))
  t.match(doc.text(), /Firefox/, 'browser name')
  t.ok(
    doc.images().some((image) => /Firefox.*logo/i.test(image.file())),
    'browser logo'
  )
  t.equal(doc.infobox().type(), 'software', 'software infobox')
  t.ok(doc.section('Geschichte'), 'German history section')
  t.ok(doc.references().length > 0, 'software sources')
  t.end()
})

test('Sara-C-Bisel', (t) => {
  const doc = wtf(readPage('Sara-C-Bisel'))
  t.equal(doc.title(), 'Sara C. Bisel', 'archaeologist name')
  t.ok(
    doc.links().some((link) => link.page() === 'Archäologie'),
    'German archaeology link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Johnstown (Pennsylvania)'),
    'birthplace link'
  )
  t.match(doc.text(), /Sara Louise Clark/, 'birth name')
  t.match(doc.text(), /1932/, 'birth year')
  t.end()
})

test('Wendy-Mogel', (t) => {
  const doc = wtf(readPage('Wendy-Mogel'))
  t.equal(doc.title(), 'Wendy Mogel', 'psychologist name')
  t.ok(
    doc.links().some((link) => link.page() === 'Klinische Psychologie'),
    'German clinical psychology link'
  )
  t.match(doc.text(), /1951/, 'birth year')
  t.match(doc.text(), /2001/, 'book publication year')
  t.ok(doc.references().length > 0, 'biographical sources')
  t.end()
})
