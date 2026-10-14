import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('2008-British-Motorcycle-Grand-Prix', (t) => {
  const doc = wtf(readPage('2008-British-Motorcycle-Grand-Prix'))
  t.equal(doc.infobox().get('Grand Prix').text(), 'British', 'race location')
  t.equal(doc.infobox().get('Location').text(), 'Donington Park', 'race circuit')
  t.equal(doc.infobox().get('Official_Name').text(), 'bwin.com British Grand Prix', 'official race name')
  t.equal(doc.infobox().get('flag').text(), 'UK', 'host country code')
  t.ok(doc.tables().length > 0, 'race standings tables')
  t.end()
})

test('AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft', (t) => {
  const doc = wtf(readPage('AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft'))
  t.equal(doc.infobox().type(), 'award', 'award infobox')
  t.match(doc.infobox().get('presenter').text(), /Australian Academy of Cinema and Television Arts/, 'presenting organization')
  t.match(doc.infobox().get('name').text(), /Outstanding Achievement in Short Film Screen Craft/, 'award name')
  t.ok(doc.links().some((link) => link.page() === 'AACTA Awards'), 'parent awards link')
  t.ok(doc.tables().length > 0, 'award recipients table')
  t.end()
})

test('Al-Haytham', (t) => {
  const doc = wtf(readPage('Al-Haytham'))
  t.equal(doc.infobox().type(), 'scientist', 'scientist infobox')
  t.match(doc.text(), /optics/i, 'scientific work appears in the article')
  t.match(doc.infobox().get('name').text(), /Hasan Ibn al-Haytham/, 'scientist name')
  t.ok(doc.references().length > 0, 'scientific biography sources')
  t.match(doc.text(), /Book of Optics/, 'principal work')
  t.end()
})

test('Alanine-Oxo-Acid-Transaminase', (t) => {
  const doc = wtf(readPage('Alanine-Oxo-Acid-Transaminase'))
  t.equal(doc.title(), 'alanine-oxo-acid transaminase', 'enzyme title')
  t.ok(doc.links().some((link) => link.page() === 'enzymology'), 'enzymology link')
  t.match(doc.text(), /enzyme/i, 'biochemical role')
  t.ok(doc.categories().some((category) => /EC 2\.6\.1/.test(category)), 'enzyme classification category')
  t.ok(doc.references().length > 0, 'research references')
  t.end()
})

test('Alexander-Y-Type', (t) => {
  const doc = wtf(readPage('Alexander-Y-Type'))
  t.match(doc.infobox().get('name').text(), /Alexander Y Type/, 'bus name')
  t.ok(doc.links().some((link) => link.page() === 'Leyland Leopard'), 'bus chassis link')
  t.equal(doc.infobox().type(), 'uk bus', 'bus infobox')
  t.match(doc.image().file(), /LeylandLeopardAlexanderYType/, 'vehicle photograph')
  t.match(doc.text(), /Walter Alexander/, 'body manufacturer')
  t.end()
})

test('Allen-R-Morris', (t) => {
  const doc = wtf(readPage('Allen-R-Morris'))
  t.equal(doc.infobox().get('birth_name').text(), 'Allen Robert Morris', 'birth name')
  t.match(doc.image().file(), /AllenMorrisHeadShot\.jpg$/, 'portrait filename')
  t.equal(doc.infobox().type(), 'person', 'biography infobox')
  t.match(doc.text(), /Emmy/, 'television awards')
  t.ok(doc.citations().length > 0, 'career sources')
  t.end()
})

test('Alsea-Company', (t) => {
  const doc = wtf(readPage('Alsea-Company'))
  t.equal(doc.infobox().type(), 'company', 'company infobox')
  t.match(doc.infobox().get('name').text(), /Alsea/, 'company name')
  t.equal(doc.infobox().get('industry').text(), 'Restaurants', 'business sector')
  t.equal(doc.infobox().get('type').text(), 'Public', 'company ownership type')
  t.ok(doc.links().some((link) => link.page() === 'Public Company'), 'ownership link')
  t.end()
})

test('Altimont-Butler', (t) => {
  const doc = wtf(readPage('Altimont-Butler'))
  t.equal(doc.infobox().get('fullname').text(), 'Altimont Butler', 'full name')
  t.equal(doc.infobox().get('name').text(), 'Freddie Butler', 'playing name')
  t.equal(doc.infobox().type(), 'football biography', 'player infobox')
  t.match(doc.text(), /Jamaica/, 'national team')
  t.ok(doc.references().length > 0, 'football career references')
  t.end()
})

test('Anarchism', (t) => {
  const doc = wtf(readPage('Anarchism'))
  t.equal(doc.title(), 'Anarchism', 'article title')
  t.ok(doc.lists().length > 0, 'article includes lists')
  t.match(doc.sentence().text(), /political philosophy/, 'opening definition')
  t.ok(doc.section('History'), 'history section')
  t.ok(doc.references().length > 0, 'historical sources')
  t.end()
})

test('Antique-Band', (t) => {
  const doc = wtf(readPage('Antique-Band'))
  t.equal(doc.infobox().type(), 'musical artist', 'musical artist infobox')
  t.match(doc.infobox().get('origin').text(), /Stockholm/, 'band origin')
  t.equal(doc.infobox().get('Name').text(), 'Antique', 'band name')
  t.match(doc.text(), /Elena Paparizou/, 'band vocalist')
  t.match(doc.text(), /Eurovision/, 'song contest participation')
  t.end()
})

test('Anwar-Kamal-Khan', (t) => {
  const doc = wtf(readPage('Anwar-Kamal-Khan'))
  t.match(doc.title(), /Anwar Kamal Khan/, 'politician name')
  t.match(doc.text(), /Pakistani Politician/i, 'occupation')
  t.match(doc.text(), /1946/, 'birth year')
  t.match(doc.text(), /2012/, 'death year')
  t.ok(doc.references().some((reference) => /Marwat|leader|Anwar/i.test(reference.title())), 'biographical reference title')
  t.end()
})

test('Arts-Club-Of-Chicago', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.image().file(), 'File:20070701_Arts_Club_of_Chicago.JPG', 'club image')
  t.ok(doc.tables().length > 0, 'article tables survive parsing')
  t.equal(doc.template(1).json().template, 'good article', 'article quality template')
  t.ok(doc.references().length > 0, 'art history sources')
  t.match(doc.text(), /1916/, 'founding year')
  t.end()
})

test('BBDO', (t) => {
  const doc = wtf(readPage('BBDO'))
  t.match(doc.text(), /BBDO/, 'German article retains the company name')
  t.ok(doc.links().some((link) => link.page() === 'Gesellschaft mit beschränkter Haftung (Deutschland)'), 'company legal-form link')
  t.equal(doc.infobox().get('Name').text(), 'BBDO Germany GmbH', 'German company name')
  t.equal(doc.infobox().get('ISIN').text(), 'nicht vorhanden', 'stock identifier status')
  t.match(doc.text(), /Werbe- und Marketingagentur/, 'German business description')
  t.end()
})

test('Bazooka', (t) => {
  const doc = wtf(readPage('Bazooka'))
  t.equal(doc.title(), 'Bazooka', 'weapon name')
  t.ok(doc.images().some((image) => /Bazookas[ _]Korea\.jpg$/.test(image.file())), 'Korean War photograph')
  t.match(doc.text(), /Antitank Rocket Launcher/, 'official weapon designation')
  t.ok(doc.sections().length > 1, 'weapon history is sectioned')
  t.ok(doc.references().length > 0, 'historical sources')
  t.end()
})

test('Bodmin', (t) => {
  const doc = wtf(readPage('Bodmin'))
  t.equal(doc.infobox().type(), 'uk place', 'UK place infobox')
  t.match(doc.text(), /Cornwall/, 'location in Cornwall')
  t.ok(doc.section('History'), 'town history section')
  t.match(doc.infobox().get('static_image_name').text(), /Bodmin Public Rooms/, 'town photograph field')
  t.ok(doc.categories().some((category) => /Cornwall/.test(category)), 'Cornwall category')
  t.end()
})

test('Bradley-Community-Lincoln-County-Wisconsin', (t) => {
  const doc = wtf(readPage('Bradley-Community-Lincoln-County-Wisconsin'))
  t.equal(doc.infobox().get('official_name').text(), 'Bradley, Wisconsin', 'official place name')
  t.equal(doc.infobox().get('settlement_type').text(), 'Unincorporated community', 'settlement type')
  t.equal(doc.infobox().type(), 'settlement', 'settlement infobox')
  t.match(doc.text(), /Lincoln County/, 'county location')
  t.ok(doc.coordinates().length > 0, 'community coordinates')
  t.end()
})

test('Britt-Morgan', (t) => {
  const doc = wtf(readPage('Britt-Morgan'))
  t.equal(doc.title(), 'Britt Morgan', 'article title')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas, United States', 'birthplace')
  t.ok(doc.links().some((link) => link.page() === 'Jace Rocker'), 'collaborator link')
  t.equal(doc.infobox().type(), 'adult biography', 'biography type')
  t.ok(doc.section('Awards'), 'awards section')
  t.end()
})

test('Canton-Of-Etaples', (t) => {
  const doc = wtf(readPage('Canton-Of-Etaples'))
  t.equal(doc.infobox().get('name').text(), 'Canton of Étaples', 'accented canton name')
  t.equal(doc.infobox().get('dept').text(), 'Pas-de-Calais', 'department')
  t.equal(doc.infobox().get('chief town').text(), 'Étaples', 'administrative seat')
  t.equal(doc.infobox().get('numcomm').text(), '15', 'number of communes')
  t.equal(doc.infobox().get('cancode').text(), '6224', 'canton code')
  t.end()
})

test('Charlie-Milstead', (t) => {
  const doc = wtf(readPage('Charlie-Milstead'))
  t.equal(doc.title(), 'Charles Frank Milstead', 'title')
  t.equal(doc.infoboxes().length, 1, 'infoboxes')
  t.equal(doc.categories().length, 9, 'categories')
  t.equal(doc.infobox().type(), 'nfl biography', 'infobox type')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas', 'birthplace')
  t.equal(doc.templates('1960 Houston Oilers').length, 1, 'team roster template')
  t.end()
})

test('Chemical-Biology', (t) => {
  const doc = wtf(readPage('Chemical-Biology'))
  t.equal(doc.title(), 'Chemical biology', 'discipline title')
  t.ok(doc.links().some((link) => link.page() === 'chemistry'), 'related discipline link')
  t.ok(doc.links().some((link) => link.page() === 'biology'), 'biology link')
  t.ok(doc.links().some((link) => link.page() === 'physics'), 'physics link')
  t.ok(doc.references().length > 0, 'scientific sources')
  t.end()
})

test('Clint-Murchison-Sr', (t) => {
  const doc = wtf(readPage('Clint-Murchison-Sr'))
  t.match(doc.title(), /Clinton Williams/, 'full name')
  t.ok(doc.citations().length > 0, 'biographical sources')
  t.match(doc.text(), /1895/, 'birth year')
  t.match(doc.text(), /1969/, 'death year')
  t.ok(doc.categories().some((category) => /Texas/.test(category)), 'Texas connection')
  t.end()
})

test('Damphu-Drum', (t) => {
  const doc = wtf(readPage('Damphu-Drum'))
  t.equal(doc.title(), 'Damphu', 'instrument name')
  t.ok(doc.links().some((link) => link.page() === 'percussion instrument'), 'instrument classification link')
  t.ok(doc.links().some((link) => link.page() === 'tambourine'), 'related instrument link')
  t.match(doc.image().file(), /Damfu[ _]nepal\.jpg$/, 'performance photograph')
  t.match(doc.text(), /Nepal/, 'musical tradition')
  t.end()
})

test('Direct-Representation', (t) => {
  const doc = wtf(readPage('Direct-Representation'))
  t.equal(doc.title(), 'Direct representation', 'political concept')
  t.ok(doc.references().length > 0, 'references survive maintenance templates')
  t.match(doc.text(), /representative/i, 'representation explanation')
  t.ok(doc.sections().length > 1, 'concept is divided into sections')
  t.ok(doc.categories().some((category) => /politic|democra|government/i.test(category)), 'political category')
  t.end()
})

test('Dollar-Point-California', (t) => {
  const doc = wtf(readPage('Dollar-Point-California'))
  t.equal(doc.infobox().get('official_name').text(), 'Dollar Point, California', 'official name')
  t.equal(doc.coordinate().lat, 39.18861, 'latitude')
  t.equal(doc.coordinate().lon, -120.10889, 'longitude')
  t.equal(doc.infobox().get('settlement_type').text(), 'census-designated place', 'settlement classification')
  t.ok(doc.section('Demographics'), 'population section')
  t.end()
})

test('Elizabeth-Gilbert', (t) => {
  const doc = wtf(readPage('Elizabeth-Gilbert'))
  t.equal(doc.infobox().type(), 'writer', 'writer infobox')
  t.equal(doc.infobox().get('name').text(), 'Elizabeth Gilbert', 'writer name')
  t.match(doc.text(), /Eat, Pray, Love/, 'best-known book')
  t.match(doc.image().file(), /Elizabeth[ _]Gilbert[ _]at[ _]TED\.jpg$/, 'author photograph')
  t.ok(doc.references().length > 0, 'biographical sources')
  t.end()
})

test('Ewelina-Setowska-Dryk', (t) => {
  const doc = wtf(readPage('Ewelina-Setowska-Dryk'))
  t.equal(doc.title(), 'Ewelina Sętowska-Dryk', 'accented athlete name')
  t.ok(doc.links().some((link) => link.page() === '800 metres'), 'running event link')
  t.ok(doc.links().some((link) => link.page() === 'Puławy'), 'birthplace link')
  t.match(doc.text(), /1980/, 'birth year')
  t.ok(doc.links().some((link) => link.page() === '2005 Summer Universiade'), 'competition link')
  t.end()
})

test('Goryeo-Ware', (t) => {
  const doc = wtf(readPage('Goryeo-Ware'))
  t.equal(doc.infobox().get('title').text(), 'Goryeo ware', 'ceramics name')
  t.equal(doc.images().length, 5, 'infobox and gallery images')
  t.equal(doc.infobox().type(), 'korean name', 'Korean name infobox')
  t.ok(doc.links().some((link) => link.page() === 'Goryeo dynasty'), 'dynasty link')
  t.match(doc.text(), /celadon/i, 'ceramic glaze')
  t.end()
})

test('Gregory-Serper', (t) => {
  const doc = wtf(readPage('Gregory-Serper'))
  t.equal(doc.title(), 'Gregory Serper', 'chess player name')
  t.ok(doc.links().some((link) => link.page() === 'Grandmaster (chess)'), 'chess title link')
  t.match(doc.text(), /1969/, 'birth year')
  t.ok(doc.links().some((link) => link.page() === 'chess'), 'sport link')
  t.ok(doc.references().some((reference) => /FIDE/.test(reference.wikitext())), 'chess federation reference')
  t.end()
})

test('Groot-Brittanje', (t) => {
  const doc = wtf(readPage('Groot-Brittanje'))
  t.ok(doc.links().some((link) => link.page() === 'Verenigde Koninkryk'), 'Afrikaans UK link')
  t.match(doc.text(), /Groot-Brittanje/, 'Afrikaans island name')
  t.equal(doc.infobox().get('naam').text(), 'Groot-Brittanje', 'Afrikaans island name field')
  t.ok(doc.links().some((link) => link.page() === 'Koninkryk van Groot-Brittanje'), 'historical kingdom link')
  t.ok(doc.categories().length > 0, 'Afrikaans categories are recognized')
  t.end()
})

test('HMS-Irresistible', (t) => {
  const doc = wtf(readPage('HMS-Irresistible'))
  t.equal(doc.title(), 'HMS Irresistible', 'ship name')
  t.ok(doc.links().some((link) => link.page() === 'Royal Navy'), 'navy link')
  t.ok(doc.lists().length > 0, 'list of ships')
  t.match(doc.text(), /britischen/, 'British navy description')
  t.ok(doc.links().some((link) => link.page() === 'Vereinigtes Königreich'), 'United Kingdom link')
  t.end()
})

test('Harry-McPherson', (t) => {
  const doc = wtf(readPage('Harry-McPherson'))
  t.equal(doc.infobox().get('name').text(), 'Harry McPherson', 'official name')
  t.equal(doc.infobox().get('office').text(), 'White House Counsel', 'office held')
  t.equal(doc.infobox().type(), 'officeholder', 'political office infobox')
  t.match(doc.infobox().get('president').text(), /Lyndon Johnson/, 'president served')
  t.match(doc.image().file(), /McPherson[ _]DLA[ _]Piper\.jpg$/, 'portrait')
  t.end()
})

test('History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales', (t) => {
  const doc = wtf(readPage('History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales'))
  t.ok(doc.links().some((link) => link.page() === 'Scotland national rugby union team'), 'Scotland team link')
  t.ok(doc.links().some((link) => link.page() === 'Wales national rugby union team'), 'Wales team link')
  t.ok(doc.tables().length > 0, 'match results tables')
  t.match(doc.sentence().text(), /1883/, 'start of the rivalry')
  t.ok(doc.links().some((link) => link.page() === 'rugby union'), 'sport link')
  t.end()
})

test('Irina-Saratovtseva', (t) => {
  const doc = wtf(readPage('Irina-Saratovtseva'))
  t.equal(doc.infobox().get('fullname').text(), 'Irina Saratovtseva', 'player name')
  t.equal(doc.infobox().type(), 'football biography', 'football biography infobox')
  t.equal(doc.infobox().get('name').text(), 'Irina Saratovtseva', 'display name')
  t.match(doc.image().file(), /ISaratovtseva\.JPG$/, 'player photograph')
  t.match(doc.text(), /goalkeeper/i, 'playing position')
  t.end()
})

test('Jerry-Mumphrey', (t) => {
  const doc = wtf(readPage('Jerry-Mumphrey'))
  t.equal(doc.infobox().get('position').text(), 'Outfielder', 'baseball position')
  t.equal(doc.infobox().get('bats').text(), 'Switch', 'batting side')
  t.equal(doc.infobox().get('throws').text(), 'Right', 'throwing arm')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas', 'birthplace')
  t.equal(doc.infobox().type(), 'baseball biography', 'baseball biography type')
  t.end()
})

test('Jodie-Emery', (t) => {
  const doc = wtf(readPage('Jodie-Emery'))
  t.equal(doc.infobox().get('name').text(), 'Jodie Emery', 'person name')
  t.match(doc.image().file(), /Marc_Emery_and_Jodie_Emery\.JPG$/, 'portrait filename')
  t.equal(doc.infobox().type(), 'person', 'person infobox')
  t.equal(doc.infobox().get('nationality').text(), 'Canadian', 'nationality')
  t.match(doc.infobox().get('caption').text(), /Toronto Freedom Festival 2010/, 'photo caption')
  t.end()
})

test('Julia-Kristeva', (t) => {
  const doc = wtf(readPage('Julia-Kristeva'))
  t.equal(doc.infobox().type(), 'philosopher', 'philosopher infobox')
  t.equal(doc.infobox().get('birth_name').text(), 'Юлия Кръстева', 'Cyrillic birth name')
  t.equal(doc.infobox().get('name').text(), 'Julia Kristeva', 'display name')
  t.match(doc.text(), /psychoanalyst/i, 'profession')
  t.match(doc.image().file(), /Kristeva/, 'portrait filename')
  t.end()
})

test('K-Nicole-Mitchell', (t) => {
  const doc = wtf(readPage('K-Nicole-Mitchell'))
  t.equal(doc.infobox().get('name').text(), 'K. Nicole Mitchell', 'judge name')
  t.match(doc.infobox().get('office').text(), /Eastern District of Texas/, 'court jurisdiction')
  t.equal(doc.infobox().type(), 'judge', 'judge infobox')
  t.match(doc.infobox().get('termstart').text(), /2013/, 'start of judicial term')
  t.match(doc.text(), /Magistrate Judge/i, 'judicial role')
  t.end()
})

test('Keilwelle', (t) => {
  const doc = wtf(readPage('Keilwelle'))
  t.ok(doc.images().length > 0, 'technical illustrations')
  t.ok(doc.images().some((image) => /Keilprofil-6K-Detail\.JPG$/.test(image.file())), 'shaft profile detail illustration')
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

test('Magnar-Saetre', (t) => {
  const doc = wtf(readPage('Magnar-Saetre'))
  t.equal(doc.title(), 'Magnar Sætre', 'Norwegian name')
  t.ok(doc.links().some((link) => link.page() === 'Bergen'), 'birthplace link')
  t.match(doc.text(), /Norwegian politician/, 'occupation')
  t.ok(doc.links().some((link) => link.page() === 'Norwegian Labour Party'), 'political party link')
  t.ok(doc.links().some((link) => link.page() === 'Stortinget'), 'parliament link')
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
  t.ok(doc.images().some((image) => /Firefox.*logo/i.test(image.file())), 'browser logo')
  t.equal(doc.infobox().type(), 'software', 'software infobox')
  t.ok(doc.section('Geschichte'), 'German history section')
  t.ok(doc.references().length > 0, 'software sources')
  t.end()
})

test('Neil-McLean-Saxophonist', (t) => {
  const doc = wtf(readPage('Neil-McLean-Saxophonist'))
  t.equal(doc.title(), 'Neil McLean', 'musician name')
  t.ok(doc.links().some((link) => link.page() === 'Ray Reach and Friends'), 'musical collaborators')
  t.match(doc.sentence().text(), /American saxophonist/, 'occupation')
  t.match(doc.text(), /Tyler, Texas/, 'residence')
  t.ok(doc.links().some((link) => link.type() === 'external'), 'external jazz ensemble link')
  t.end()
})

test('RNDIS', (t) => {
  const doc = wtf(readPage('RNDIS'))
  t.equal(doc.title(), 'Remote Network Driver Interface Specification (RNDIS)', 'expanded protocol name')
  t.ok(doc.links().some((link) => link.page() === 'USB'), 'transport link')
  t.ok(doc.links().some((link) => link.page() === 'Microsoft'), 'protocol vendor link')
  t.ok(doc.links().some((link) => link.page() === 'Ethernet'), 'network interface link')
  t.match(doc.text(), /proprietary protocol/, 'protocol description')
  t.end()
})

test('RNLI-Stations', (t) => {
  const doc = wtf(readPage('RNLI-Stations'))
  t.equal(doc.section('Key').title(), 'Key', 'table legend section')
  t.ok(doc.section('East Division').tables().length > 0, 'regional station table')
  t.equal(doc.categories().length, 5, 'station list categories')
  t.ok(doc.images().some((image) => /Tenby/.test(image.file())), 'Tenby lifeboat station photograph')
  t.equal(doc.section('East Division').indentation(), 1, 'regional section depth')
  t.end()
})

test('Raith-Rovers', (t) => {
  const doc = wtf(readPage('Raith-Rovers'))
  t.equal(doc.infobox().get('clubname').text(), 'Raith Rovers', 'club name')
  t.equal(doc.infobox().type(), 'football club', 'football club infobox')
  t.equal(doc.infobox().get('fullname').text(), 'Raith Rovers Football Club', 'full club name')
  t.match(doc.text(), /Kirkcaldy/, 'club home town')
  t.ok(doc.images().some((image) => /Raith/.test(image.file())), 'club crest')
  t.end()
})

test('Remote-Application-Programming-Interface', (t) => {
  const doc = wtf(readPage('Remote-Application-Programming-Interface'))
  t.equal(doc.title(), 'Remote Application Programming Interface', 'API name')
  t.ok(doc.links().some((link) => link.page() === 'Pocket PC'), 'server platform link')
  t.ok(doc.links().some((link) => link.page() === 'Remote Procedure Call'), 'RPC link')
  t.match(doc.text(), /server/, 'Pocket PC server role')
  t.match(doc.text(), /client/, 'PC client role')
  t.end()
})

test('Remote-Data-Objects', (t) => {
  const doc = wtf(readPage('Remote-Data-Objects'))
  t.equal(doc.title(), 'Remote Data Objects', 'technology name')
  t.ok(doc.links().some((link) => link.page() === 'Visual Basic'), 'programming language link')
  t.ok(doc.links().some((link) => link.page() === 'Windows 95'), 'supported operating system link')
  t.match(doc.text(), /obsolete/, 'technology status')
  t.ok(doc.links().some((link) => link.page() === 'data access'), 'data access link')
  t.end()
})

test('Remote-Data-Services', (t) => {
  const doc = wtf(readPage('Remote-Data-Services'))
  t.equal(doc.title(), 'Remote Data Services', 'technology name')
  t.ok(doc.links().some((link) => link.page() === 'ActiveX Data Objects'), 'related technology link')
  t.ok(doc.links().some((link) => link.page() === 'Transact-SQL'), 'SQL extension link')
  t.match(doc.text(), /SOAP Toolkit 2\.0/, 'replacement technology')
  t.ok(doc.lists().some((list) => list.lines().some((line) => /MSDN/.test(line.text()))), 'MSDN resource list')
  t.end()
})

test('Routing-And-Remote-Access-Service', (t) => {
  const doc = wtf(readPage('Routing-And-Remote-Access-Service'))
  t.equal(doc.title(), 'Routing and Remote Access Service', 'service name')
  t.ok(doc.links().some((link) => link.page() === 'Router (computing)'), 'router link')
  t.ok(doc.links().some((link) => link.page() === 'Server (computing)'), 'server link')
  t.ok(doc.links().some((link) => link.page() === 'API'), 'API link')
  t.match(doc.text(), /Microsoft/, 'vendor')
  t.end()
})

test('Royal-Cinema', (t) => {
  const doc = wtf(readPage('Royal-Cinema'))
  t.equal(doc.infobox().get('name').text(), 'Royal Cinema', 'venue name')
  t.equal(doc.infobox().get('former names').text(), 'The Pylon, The Golden Princess', 'former venue names')
  t.equal(doc.infobox().type(), 'venue', 'venue infobox')
  t.match(doc.image().file(), /Royal_Cinema\.JPG$/, 'cinema photograph')
  t.equal(doc.infobox().get('caption').text(), 'The Royal Cinema in 2009', 'photo caption')
  t.end()
})

test('Runtime-Callable-Wrapper', (t) => {
  const doc = wtf(readPage('Runtime-Callable-Wrapper'))
  t.equal(doc.title(), 'Runtime Callable Wrapper', 'wrapper name')
  t.ok(doc.links().some((link) => link.page() === 'Component Object Model'), 'COM link')
  t.ok(doc.links().some((link) => link.page() === 'Common Language Runtime'), 'runtime link')
  t.ok(doc.links().some((link) => link.page() === 'proxy pattern'), 'design pattern link')
  t.match(doc.text(), /\.NET/, 'software platform')
  t.end()
})

test('Sara-C-Bisel', (t) => {
  const doc = wtf(readPage('Sara-C-Bisel'))
  t.equal(doc.title(), 'Sara C. Bisel', 'archaeologist name')
  t.ok(doc.links().some((link) => link.page() === 'Archäologie'), 'German archaeology link')
  t.ok(doc.links().some((link) => link.page() === 'Johnstown (Pennsylvania)'), 'birthplace link')
  t.match(doc.text(), /Sara Louise Clark/, 'birth name')
  t.match(doc.text(), /1932/, 'birth year')
  t.end()
})

test('Senate-Of-Pakistan', (t) => {
  const doc = wtf(readPage('Senate-Of-Pakistan'))
  t.equal(doc.infobox().type(), 'legislature', 'legislature infobox')
  t.equal(doc.infobox().get('name').text(), 'Senate of Pakistan', 'legislature name')
  t.match(doc.text(), /upper legislative chamber/i, 'legislative role')
  t.ok(doc.links().some((link) => link.page() === 'Pakistan'), 'country link')
  t.ok(doc.tables().length > 0, 'parliamentary data tables')
  t.end()
})

test('Statoil', (t) => {
  const doc = wtf(readPage('Statoil'))
  t.equal(doc.infobox().type(), 'verksemd', 'Nynorsk business infobox')
  t.equal(doc.infobox().get('namn').text(), 'Statoil ASA', 'Nynorsk company name field')
  t.equal(doc.infobox().get('selskapsform').text(), 'Allmenaksjeføretak', 'company legal form')
  t.match(doc.infobox().get('hovudkontor').text(), /Stavanger/, 'headquarters')
  t.ok(doc.links().some((link) => link.page() === 'Noreg'), 'Nynorsk country link')
  t.end()
})

test('Terrence-Murphy-American-Football', (t) => {
  const doc = wtf(readPage('Terrence-Murphy-American-Football'))
  t.equal(doc.infobox().get('name').text(), 'Terrence Murphy', 'player name')
  t.equal(doc.infobox().get('position').text(), 'Wide receiver', 'football position')
  t.equal(doc.infobox().type(), 'nfl player', 'NFL player infobox')
  t.match(doc.infobox().get('birth_place').text(), /Tyler, Texas/, 'birthplace')
  t.ok(doc.references().length > 0, 'career references')
  t.end()
})

test('Teymanak-E-Olya', (t) => {
  const doc = wtf(readPage('Teymanak-E-Olya'))
  t.equal(doc.infobox().get('official_name').text(), 'Teymanak-e Olya', 'village name')
  t.equal(doc.infobox().get('native_name').text(), 'تيمنك عليا', 'Persian village name')
  t.equal(doc.infobox().get('settlement_type').text(), 'village', 'settlement type')
  t.equal(doc.infobox().get('pushpin_map').text(), 'Iran', 'map country')
  t.equal(doc.infobox().type(), 'settlement', 'settlement infobox')
  t.end()
})

test('The-Atlas-Newspaper', (t) => {
  const doc = wtf(readPage('The-Atlas-Newspaper'))
  t.equal(doc.title(), 'The Atlas', 'newspaper title')
  t.ok(doc.links().some((link) => link.page() === 'Robert Stephen Rintoul'), 'founder link')
  t.ok(doc.section('History'), 'newspaper history section')
  t.match(doc.text(), /1826/, 'founding year')
  t.ok(doc.links().some((link) => link.page() === 'London'), 'founding city link')
  t.end()
})

test('The-Field-Of-Waterloo', (t) => {
  const doc = wtf(readPage('The-Field-Of-Waterloo'))
  t.equal(doc.title(), 'The Field of Waterloo', 'poem title')
  t.ok(doc.links().some((link) => link.page() === 'Sir Walter Scott'), 'poet link')
  t.match(doc.text(), /1815/, 'publication year')
  t.ok(doc.references().length > 0, 'bibliographic references')
  t.ok(doc.categories().some((category) => /poem/i.test(category)), 'poetry category')
  t.end()
})

test('Toronto', (t) => {
  const doc = wtf(readPage('Toronto'))
  t.equal(doc.title(), 'Toronto', 'city title')
  t.ok(doc.links().some((link) => link.page() === 'Ontario'), 'province link')
  t.ok(doc.section('History'), 'city history section')
  t.ok(doc.links().some((link) => link.page() === 'Lake Ontario'), 'waterfront location')
  t.ok(doc.infoboxes().length > 0, 'municipal infobox')
  t.end()
})

test('Toronto-Star', (t) => {
  const doc = wtf(readPage('Toronto-Star'))
  t.equal(doc.infobox().type(), 'newspaper', 'newspaper infobox')
  t.equal(doc.infobox().get('publisher').text(), 'John D. Cruickshank', 'publisher in this snapshot')
  t.ok(doc.section('History'), 'newspaper history section')
  t.match(doc.image().file(), /Toronto[ _]Star[ _]frontpage/, 'front-page image')
  t.ok(doc.references().length > 0, 'newspaper references')
  t.end()
})

test('Tour-EP-Band-Of-Horses-EP', (t) => {
  const doc = wtf(readPage('Tour-EP-Band-Of-Horses-EP'))
  t.equal(doc.infobox().get('name').text(), 'Tour EP', 'release title')
  t.equal(doc.infobox().get('artist').text(), 'Band of Horses', 'performing artist')
  t.equal(doc.infobox().get('Type').text(), 'EP', 'release format')
  t.equal(doc.infobox().get('Released').text(), '2005', 'release year')
  t.equal(doc.infobox().type(), 'album', 'album infobox')
  t.end()
})

test('United-Kingdom', (t) => {
  const doc = wtf(readPage('United-Kingdom'))
  t.match(doc.title(), /United Kingdom/, 'country title')
  t.ok(doc.links().some((link) => link.page() === 'London'), 'capital city link')
  t.ok(doc.section('History'), 'national history section')
  t.ok(doc.links().some((link) => link.page() === 'Great Britain'), 'largest island link')
  t.ok(doc.references().length > 0, 'country references')
  t.end()
})

test('University-Of-Nevada-Reno-Arboretum', (t) => {
  const doc = wtf(readPage('University-Of-Nevada-Reno-Arboretum'))
  t.equal(doc.title(), 'University of Nevada, Reno Arboretum', 'arboretum name')
  t.ok(doc.coordinates().length > 0, 'arboretum location')
  t.ok(doc.links().some((link) => link.page() === 'arboretum'), 'arboretum classification link')
  t.equal(doc.coordinate().lat, 39.54583, 'latitude')
  t.equal(doc.coordinate().lon, -119.81667, 'longitude')
  t.end()
})

test('Wendy-Mogel', (t) => {
  const doc = wtf(readPage('Wendy-Mogel'))
  t.equal(doc.title(), 'Wendy Mogel', 'psychologist name')
  t.ok(doc.links().some((link) => link.page() === 'Klinische Psychologie'), 'German clinical psychology link')
  t.match(doc.text(), /1951/, 'birth year')
  t.match(doc.text(), /2001/, 'book publication year')
  t.ok(doc.references().length > 0, 'biographical sources')
  t.end()
})
