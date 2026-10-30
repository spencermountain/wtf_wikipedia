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
  t.equal(
    doc.sentences()[4].links()[2].page(),
    'Chief Financial Officer',
    "BBDO: 5th sentence links to 'Chief Financial Officer'"
  )
  t.equal(doc.sentences()[10].links()[0].text(), 'Daimler', "BBDO: 11th sentence shows 'Daimler' for Daimler AG")
  t.equal(
    doc.sentences()[14].text(),
    'The Big Won kürt BBDO 2012 zum sechsten Mal in Folge zum Netzwerk des Jahres.',
    'BBDO: 15th sentence text'
  )
  t.equal(doc.sections()[7].title(), 'Einzelnachweise', 'BBDO: section [7] title')
  t.equal(
    doc.section('Agenturen').sentences()[0].links()[0].page(),
    'Ketchum Pleon',
    "BBDO: 'Agenturen' section, 1st sentence links to 'Ketchum Pleon'"
  )
  t.ok(
    doc.sentences()[4].text().startsWith('In Deutschland leitet Frank Lotze als Chief'),
    "BBDO: 5th sentence starts 'In Deutschland leitet Frank Lo…'"
  )
  t.equal(doc.lists()[1].lines()[1].text(), 'Offizielle Webpräsenz BBDO Worldwide', 'BBDO: list 2, item 2')
  t.equal(doc.images()[0].file(), 'File:BBDO_Logo.png', 'BBDO: 1st image file')
  t.equal(doc.categories()[1], 'Dienstleistungsunternehmen (Düsseldorf)', 'BBDO: 2nd category')
  t.equal(doc.sections().length, 8, 'BBDO: 8 sections')
  t.equal(
    doc.section('Geschichte').sentences()[2].links()[0].page(),
    'Vilim Vasata',
    "BBDO: 'Geschichte' section, 3rd sentence links to 'Vilim Vasata'"
  )
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
  t.equal(
    doc.section('Nachbauten und Einfluss auf Waffenentwicklung').sentences()[0].links()[0].page(),
    'Panzerschreck',
    "Bazooka: 'Nachbauten und Einfluss auf Waffenentwicklung' section, 1st sentence links to 'Panzerschreck'"
  )
  t.equal(
    doc.section('Sonstige').sentences()[0].links()[0].text(),
    'Nationalrevolutionären Armee',
    "Bazooka: 'Sonstige' section, 1st sentence shows 'Nationalrevolutionären Armee' for Nationalrevolutionäre Armee"
  )
  t.equal(
    doc.section('Nachbauten und Einfluss auf Waffenentwicklung').sentences()[0].text(),
    'Während des Zweiten Weltkrieges entwickelten die Deutschen auf Grundlage der Bazooka den Panzerschreck.',
    "Bazooka: 'Nachbauten und Einfluss auf Waffenentwicklung' section, 1st sentence text"
  )
  t.equal(doc.sections()[12].title(), 'M18', 'Bazooka: section [12] title')
  t.equal(
    doc.section('M24- und M66-Richtminen').sentences()[6].links()[1].page(),
    'Ho-Chi-Minh-Pfad',
    "Bazooka: 'M24- und M66-Richtminen' section, 7th sentence links to 'Ho-Chi-Minh-Pfad'"
  )
  t.equal(doc.tables()[0].rows()[0]['modell'], 'M1/M1A1', "Bazooka: table 1, row 1, 'modell' column")
  t.ok(
    doc
      .section('Rakete mit Hohlladungsprengkopf')
      .sentences()[7]
      .text()
      .startsWith('Nach dem Erhalt von Kessenichs Zeichnungen arbeiteten'),
    "Bazooka: 'Rakete mit Hohlladungsprengkopf' section, 8th sentence starts 'Nach dem Erhalt von Kessenichs…'"
  )
  t.equal(
    doc.lists()[5].lines()[3].text(),
    "Bazooka: 'Magnificent Weapon’ or a 'Crapshoot Fielded Too Soon’? (en)",
    'Bazooka: list 6, item 4'
  )
  t.equal(
    doc.section('Literatur').sentences()[0].bolds()[0].text,
    'Handbücher',
    "Bazooka: 'Literatur' section, 1st sentence bolds 'Handbücher'"
  )
  t.equal(doc.images()[6].file(), 'File:Bazooka_M1_Sight.PNG', 'Bazooka: 7th image file')
  t.equal(doc.section('Technische Daten').depth(), 1, "Bazooka: 'Technische Daten' is a depth-1 subsection")
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
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'englischen',
    "HMS-Irresistible: 1st sentence shows 'englischen' for Englische Sprache"
  )
  t.equal(
    doc.sentences()[0].text(),
    'Mindestens vier Schiffe der britischen Royal Navy trugen den Namen HMS Irresistible nach dem englischen Wort für „unwiderstehlich“.',
    'HMS-Irresistible: 1st sentence text'
  )
  t.equal(
    doc.lists()[0].lines()[2].text(),
    'Die dritte Irresistible war ein Linienschiff dritter Klasse, das 1860 vom Stapel lief und 1891 verkauft wurde.',
    'HMS-Irresistible: list 1, item 3'
  )
  t.equal(
    doc.links()[12].page(),
    'Formidable-Klasse (Royal Navy)',
    "HMS-Irresistible: link [12] is 'Formidable-Klasse (Royal Navy)'"
  )
  t.equal(doc.links()[6].page(), 'HMS Swiftsure', "HMS-Irresistible: link [6] is 'HMS Swiftsure'")
  t.equal(doc.links()[3].page(), 'Linienschiff', "HMS-Irresistible: link [3] is 'Linienschiff'")
  t.equal(
    doc.links()[5].page(),
    'Seeschlacht bei Kap St. Vincent (1797)',
    "HMS-Irresistible: link [5] is 'Seeschlacht bei Kap St. Vincent (1797)'"
  )
  t.equal(doc.links()[11].page(), 'Schlachtschiff', "HMS-Irresistible: link [11] is 'Schlachtschiff'")
  t.equal(doc.links()[4].page(), 'Harwich', "HMS-Irresistible: link [4] is 'Harwich'")
  t.equal(doc.links()[9].page(), 'Schlacht von Trafalgar', "HMS-Irresistible: link [9] is 'Schlacht von Trafalgar'")
  t.equal(doc.links()[13].page(), 'Schlacht von Gallipoli', "HMS-Irresistible: link [13] is 'Schlacht von Gallipoli'")
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
  t.ok(doc.section('keilwellen-verbindungen'), 'Keilwelle: Keilwellen-Verbindungen section')
  t.ok(doc.categories().includes('Bauform (Welle)'), 'Keilwelle: Bauform (Welle) category')
  t.equal(
    doc.section('Herstellung').sentences()[6].links()[0].page(),
    'Wälzfräsen',
    "Keilwelle: 'Herstellung' section, 7th sentence links to 'Wälzfräsen'"
  )
  t.equal(doc.sentences()[0].links()[0].text(), 'Wellen', "Keilwelle: 1st sentence shows 'Wellen' for Welle (Mechanik)")
  t.equal(
    doc.sentences()[35].text(),
    'Welle und Nabe können bei entsprechender Passung nicht verschiebbar, ohne Last verschiebbar oder auch unter Last verschiebbar sein.',
    'Keilwelle: 36th sentence text'
  )
  t.equal(doc.sections()[7].title(), 'Weblinks', 'Keilwelle: section [7] title')
  t.equal(doc.sentences()[0].links()[1].page(), 'Formschluss', "Keilwelle: 1st sentence links to 'Formschluss'")
  t.equal(
    doc.tables()[1].rows()[2]['sonstige_und_veraltete_normen'],
    'DIN 5463',
    "Keilwelle: table 2, row 3, 'sonstige_und_veraltete_normen' column"
  )
  t.ok(
    doc.section('Funktion').sentences()[5].text().startsWith('Ein Abbrechen der Keile (Zahnbruch) ist normalerweise'),
    "Keilwelle: 'Funktion' section, 6th sentence starts 'Ein Abbrechen der Keile (Zahnb…'"
  )
  t.equal(doc.lists()[1].lines()[4].text(), 'Senkerodieren', 'Keilwelle: list 2, item 5')
  t.equal(doc.images()[1].file(), 'File:Keilprofil-6K-Detail.JPG', 'Keilwelle: 2nd image file')
  t.equal(doc.categories()[1], 'Verbindungselement', 'Keilwelle: 2nd category')
  t.equal(doc.section('Herstellung').depth(), 1, "Keilwelle: 'Herstellung' is a depth-1 subsection")
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
  t.equal(
    doc.sentences()[0].text(),
    'Adresse: Embajada de Argentina en Chile Calle Miraflores Nº285, Santiago, Santiago de Chile.',
    'Liste-Der-Argentinischen-Botschafter-In-Chile: 1st sentence text (line-break joined)'
  )
  t.equal(
    doc.tables()[0].rows()[14]['bemerkungen'],
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: table 1, row 15, 'bemerkungen' column"
  )
  t.equal(
    doc.links()[20].page(),
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: link [20] is 'Ministre plénipotentiaire'"
  )
  t.ok(
    doc.templates('SortKeyName').length > 0,
    'Liste-Der-Argentinischen-Botschafter-In-Chile: has a {{SortKeyName}} template'
  )
  t.equal(
    doc.links()[15].page(),
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: link [15] is 'Ministre plénipotentiaire'"
  )
  t.equal(doc.sentences().length, 1, 'Liste-Der-Argentinischen-Botschafter-In-Chile: one sentence in the intro')
  t.equal(
    doc.tables()[0].rows()[9]['bemerkungen'],
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: table 1, row 10, 'bemerkungen' column"
  )
  t.equal(
    doc.links()[21].page(),
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: link [21] is 'Ministre plénipotentiaire'"
  )
  t.equal(
    doc.links()[10].page(),
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: link [10] is 'Ministre plénipotentiaire'"
  )
  t.equal(
    doc.tables()[0].rows()[8]['bemerkungen'],
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: table 1, row 9, 'bemerkungen' column"
  )
  t.equal(
    doc.links()[9].page(),
    'Ministre plénipotentiaire',
    "Liste-Der-Argentinischen-Botschafter-In-Chile: link [9] is 'Ministre plénipotentiaire'"
  )
  t.end()
})

test('Maurische-Netzwuhle', (t) => {
  const doc = wtf(readPage('Maurische-Netzwuhle'))
  t.match(doc.text(), /Blanus cinereus/, 'Maurische-Netzwuhle: scientific species name')
  t.equal(doc.title, 'Maurische Netzwühle', 'Maurische-Netzwuhle: German species name')
  t.equal(
    doc.infobox().get('Taxon_WissName').text(),
    'Blanus cinereus',
    'Maurische-Netzwuhle: taxonomic scientific name field'
  )
  t.equal(doc.infobox().get('Taxon_Rang').text(), 'Art', 'Maurische-Netzwuhle: species taxonomic rank')
  t.ok(doc.categories().length > 0, 'Maurische-Netzwuhle: species categories')
  t.ok(doc.categories().includes('Doppelschleichen'), 'Maurische-Netzwuhle: Doppelschleichen category')
  t.ok(
    doc.links().some((link) => link.page() === 'Doppelschleichen'),
    'Maurische-Netzwuhle: Doppelschleichen link'
  )
  t.equal(doc.sentences()[13].links()[0].page(), 'Ameisen', "Maurische-Netzwuhle: 14th sentence links to 'Ameisen'")
  t.equal(doc.sentences()[10].links()[0].text(), 'NN', "Maurische-Netzwuhle: 11th sentence shows 'NN' for Normalnull")
  t.equal(
    doc.sentences()[12].text(),
    'Die Art lebt überwiegend unterirdisch im Boden, nur sehr selten unter Steinen.',
    'Maurische-Netzwuhle: 13th sentence text'
  )
  t.equal(doc.sections()[8].title(), 'Weblinks', 'Maurische-Netzwuhle: section [8] title')
  t.equal(
    doc.section('Verbreitung und Lebensraum').sentences()[1].links()[0].page(),
    'Portugal',
    "Maurische-Netzwuhle: 'Verbreitung und Lebensraum' section, 2nd sentence links to 'Portugal'"
  )
  t.ok(
    doc.sentences()[0].text().startsWith('Die Maurische Netzwühle (Blanus cinereus), auch Ringelschleiche'),
    "Maurische-Netzwuhle: 1st sentence starts 'Die Maurische Netzwühle (Blanu…'"
  )
  t.equal(
    doc.lists()[1].lines()[0].text(),
    'Blanus cinereus In: The Reptile Database',
    'Maurische-Netzwuhle: list 2, item 1'
  )
  t.equal(
    doc.lists()[1].lines()[1].text(),
    'Fotos der Maurischen Netzwühle auf www.herp.it',
    'Maurische-Netzwuhle: list 2, item 2'
  )
  t.equal(doc.section('Einzelnachweise').depth(), 1, "Maurische-Netzwuhle: 'Einzelnachweise' is a depth-1 subsection")
  t.equal(doc.sections().length, 9, 'Maurische-Netzwuhle: 9 sections')
  t.equal(doc.sentences()[15].links()[0].page(), 'IUCN', "Maurische-Netzwuhle: 16th sentence links to 'IUCN'")
  t.equal(
    doc.section('Verbreitung und Lebensraum').sentences()[3].links()[0].text(),
    'NN',
    "Maurische-Netzwuhle: 'Verbreitung und Lebensraum' section, 4th sentence shows 'NN' for Normalnull"
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
  t.ok(doc.section('geschichte'), 'Mozilla-Firefox: German history section')
  t.ok(doc.references().length > 0, 'Mozilla-Firefox: software sources')
  t.ok(
    doc.links().some((link) => link.page() === 'Amerikanisches Englisch'),
    'Mozilla-Firefox: Amerikanisches Englisch link'
  )
  t.ok(doc.section('name'), 'Mozilla-Firefox: Name section')
  t.equal(
    doc.section('Erweiterungen').sentences()[4].links()[1].page(),
    'Programmierschnittstelle',
    "Mozilla-Firefox: 'Erweiterungen' section, 5th sentence links to 'Programmierschnittstelle'"
  )
  t.equal(
    doc.section('Funktionen und Eigenschaften').sentences()[0].links()[1].text(),
    'HTML',
    "Mozilla-Firefox: 'Funktionen und Eigenschaften' section, 1st sentence shows 'HTML' for Hypertext Markup Language"
  )
  t.equal(
    doc.section('Kritik').sentences()[8].text(),
    'Kritiker verwiesen darauf, dass für die Implementierung des Kopierschutzes Quellcode verwendet werde, der nicht quelloffen sei.',
    "Mozilla-Firefox: 'Kritik' section, 9th sentence text"
  )
  t.equal(doc.sections()[6].title(), 'Technische Merkmale', 'Mozilla-Firefox: section [6] title')
  t.equal(
    doc.sentences()[15].links()[1].page(),
    'Lightning (Software)',
    "Mozilla-Firefox: 16th sentence links to 'Lightning (Software)'"
  )
  t.equal(doc.tables()[1].rows()[11]['quartal'], 'Q3/2007', "Mozilla-Firefox: table 2, row 12, 'quartal' column")
  t.equal(
    doc.references()[0].title(),
    'Is it true that Mozilla wants to rewrite Firefox in Rust language for security reasons?',
    'Mozilla-Firefox: 1st reference title'
  )
  t.ok(
    doc
      .section('Technische Merkmale')
      .sentences()[8]
      .text()
      .startsWith('Darüber hinaus sind für verschiedene Plattformen optimierte'),
    "Mozilla-Firefox: 'Technische Merkmale' section, 9th sentence starts 'Darüber hinaus sind für versch…'"
  )
  t.equal(
    doc.lists()[2].lines()[1].text(),
    'Firefox-Erweiterungen – offizielle Programm-Erweiterungen für den Mozilla Firefox',
    'Mozilla-Firefox: list 3, item 2'
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Mozilla Firefox',
    "Mozilla-Firefox: 1st sentence bolds 'Mozilla Firefox'"
  )
  t.equal(doc.images()[1].file(), 'File:Mozilla-Phoenix-Logo.png', 'Mozilla-Firefox: 2nd image file')
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
  t.ok(doc.section('leben'), 'Sara-C-Bisel: Leben section')
  t.match(doc.text(), /Carnegie Mellon University/, 'Sara-C-Bisel: university education')
  t.equal(
    doc.section('Herkunft, Ausbildung und Privatleben').sentences()[3].links()[0].page(),
    'Harry F. Bisel',
    "Sara-C-Bisel: 'Herkunft, Ausbildung und Privatleben' section, 4th sentence links to 'Harry F. Bisel'"
  )
  t.equal(
    doc.section('Wissenschaftliche Laufbahn').sentences()[1].links()[0].text(),
    'University of Maryland',
    "Sara-C-Bisel: 'Wissenschaftliche Laufbahn' section, 2nd sentence shows 'University of Maryland' for University of Maryland, College Park"
  )
  t.equal(doc.sentences()[25].text(), 'Wissenschaftliche Fachartikel', 'Sara-C-Bisel: 26th sentence text')
  t.equal(doc.sections()[6].title(), 'Literatur', 'Sara-C-Bisel: section [6] title')
  t.equal(
    doc.sentences()[4].links()[0].page(),
    'Harry F. Bisel',
    "Sara-C-Bisel: 5th sentence links to 'Harry F. Bisel'"
  )
  t.ok(
    doc.sentences()[6].text().startsWith('Im Alter von 63 Jahren beging Sara'),
    "Sara-C-Bisel: 7th sentence starts 'Im Alter von 63 Jahren beging…'"
  )
  t.equal(doc.lists()[0].lines()[5].text(), 'National Geographic Explorer’s Club', 'Sara-C-Bisel: list 1, item 6')
  t.equal(
    doc.section('Publikationen (Auswahl)').sentences()[0].bolds()[0].text,
    'Monographien',
    "Sara-C-Bisel: 'Publikationen (Auswahl)' section, 1st sentence bolds 'Monographien'"
  )
  t.equal(doc.images()[0].file(), 'File:Herculaneum_Bootshaeuser.jpg', 'Sara-C-Bisel: 1st image file')
  t.equal(doc.categories()[3], 'Hochschullehrer (University of Maryland, College Park)', 'Sara-C-Bisel: 4th category')
  t.equal(
    doc.section('Wissenschaftliche Laufbahn').depth(),
    1,
    "Sara-C-Bisel: 'Wissenschaftliche Laufbahn' is a depth-1 subsection"
  )
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
  t.equal(
    doc.section('Leben und Werk').sentences()[3].links()[0].page(),
    'Middlebury College',
    "Wendy-Mogel: 'Leben und Werk' section, 4th sentence links to 'Middlebury College'"
  )
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'amerikanische',
    "Wendy-Mogel: 1st sentence shows 'amerikanische' for Vereinigte Staaten"
  )
  t.equal(
    doc.section('Leben und Werk').sentences()[4].text(),
    'Nach der Hochzeit ging das Paar gemeinsam nach Hollywood.',
    "Wendy-Mogel: 'Leben und Werk' section, 5th sentence text"
  )
  t.equal(doc.sections()[3].title(), 'Weblinks', 'Wendy-Mogel: section [3] title')
  t.equal(
    doc.sentences()[7].links()[0].page(),
    'Cedars-Sinai Medical Center',
    "Wendy-Mogel: 8th sentence links to 'Cedars-Sinai Medical Center'"
  )
  t.ok(
    doc.sentences()[8].text().startsWith('Angeregt durch diese Berufserfahrung und durch ihre'),
    "Wendy-Mogel: 9th sentence starts 'Angeregt durch diese Berufserf…'"
  )
  t.equal(
    doc.lists()[1].lines()[2].text(),
    'Jewish United Fund Interviews Wendy Mogel Interview mit Wendy Mogel über ihr Buch The Blessings of a B Minus',
    'Wendy-Mogel: list 2, item 3'
  )
  t.equal(doc.categories()[2], 'Geboren 1951', 'Wendy-Mogel: 3rd category')
  t.equal(doc.sections().length, 5, 'Wendy-Mogel: 5 sections')
  t.equal(doc.sentences()[0].links()[0].page(), '23. März', "Wendy-Mogel: 1st sentence links to '23. März'")
  t.equal(
    doc.sentences()[3].links()[0].text(),
    'orthodoxen Glauben',
    "Wendy-Mogel: 4th sentence shows 'orthodoxen Glauben' for Orthodoxes Judentum"
  )
  t.end()
})
