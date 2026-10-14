import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('2008-British-Motorcycle-Grand-Prix', (t) => {
  const doc = wtf(readPage('2008-British-Motorcycle-Grand-Prix'))
  t.equal(doc.infobox().get('Grand Prix').text(), 'British', 'race location')
  t.equal(doc.infobox().get('Location').text(), 'Donington Park', 'race circuit')
  t.end()
})

test('AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft', (t) => {
  const doc = wtf(readPage('AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft'))
  t.equal(doc.infobox().type(), 'award', 'award infobox')
  t.match(doc.infobox().get('presenter').text(), /Australian Academy of Cinema and Television Arts/, 'presenting organization')
  t.end()
})

test('Al-Haytham', (t) => {
  const doc = wtf(readPage('Al-Haytham'))
  t.equal(doc.infobox().type(), 'scientist', 'scientist infobox')
  t.match(doc.text(), /optics/i, 'scientific work appears in the article')
  t.end()
})

test('Alanine-Oxo-Acid-Transaminase', (t) => {
  const doc = wtf(readPage('Alanine-Oxo-Acid-Transaminase'))
  t.equal(doc.title(), 'alanine-oxo-acid transaminase', 'enzyme title')
  t.ok(doc.links().some((link) => link.page() === 'enzymology'), 'enzymology link')
  t.end()
})

test('Alexander-Y-Type', (t) => {
  const doc = wtf(readPage('Alexander-Y-Type'))
  t.match(doc.infobox().get('name').text(), /Alexander Y Type/, 'bus name')
  t.ok(doc.links().some((link) => link.page() === 'Leyland Leopard'), 'bus chassis link')
  t.end()
})

test('Allen-R-Morris', (t) => {
  const doc = wtf(readPage('Allen-R-Morris'))
  t.equal(doc.infobox().get('birth_name').text(), 'Allen Robert Morris', 'birth name')
  t.match(doc.image().file(), /AllenMorrisHeadShot\.jpg$/, 'portrait filename')
  t.end()
})

test('Alsea-Company', (t) => {
  const doc = wtf(readPage('Alsea-Company'))
  t.equal(doc.infobox().type(), 'company', 'company infobox')
  t.match(doc.infobox().get('name').text(), /Alsea/, 'company name')
  t.end()
})

test('Altimont-Butler', (t) => {
  const doc = wtf(readPage('Altimont-Butler'))
  t.equal(doc.infobox().get('fullname').text(), 'Altimont Butler', 'full name')
  t.equal(doc.infobox().get('name').text(), 'Freddie Butler', 'playing name')
  t.end()
})

test('Anarchism', (t) => {
  const doc = wtf(readPage('Anarchism'))
  t.equal(doc.title(), 'Anarchism', 'article title')
  t.ok(doc.lists().length > 0, 'article includes lists')
  t.end()
})

test('Antique-Band', (t) => {
  const doc = wtf(readPage('Antique-Band'))
  t.equal(doc.infobox().type(), 'musical artist', 'musical artist infobox')
  t.match(doc.infobox().get('origin').text(), /Stockholm/, 'band origin')
  t.end()
})

test('Anwar-Kamal-Khan', (t) => {
  const doc = wtf(readPage('Anwar-Kamal-Khan'))
  t.match(doc.title(), /Anwar Kamal Khan/, 'politician name')
  t.match(doc.text(), /Pakistani Politician/i, 'occupation')
  t.end()
})

test('Arts-Club-Of-Chicago', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.image().file(), 'File:20070701_Arts_Club_of_Chicago.JPG', 'club image')
  t.ok(doc.tables().length > 0, 'article tables survive parsing')
  t.end()
})

test('BBDO', (t) => {
  const doc = wtf(readPage('BBDO'))
  t.match(doc.text(), /BBDO/, 'German article retains the company name')
  t.ok(doc.links().some((link) => link.page() === 'Gesellschaft mit beschränkter Haftung (Deutschland)'), 'company legal-form link')
  t.end()
})

test('Bazooka', (t) => {
  const doc = wtf(readPage('Bazooka'))
  t.equal(doc.title(), 'Bazooka', 'weapon name')
  t.ok(doc.images().some((image) => /Bazookas[ _]Korea\.jpg$/.test(image.file())), 'Korean War photograph')
  t.end()
})

test('Bodmin', (t) => {
  const doc = wtf(readPage('Bodmin'))
  t.equal(doc.infobox().type(), 'uk place', 'UK place infobox')
  t.match(doc.text(), /Cornwall/, 'location in Cornwall')
  t.end()
})

test('Bradley-Community-Lincoln-County-Wisconsin', (t) => {
  const doc = wtf(readPage('Bradley-Community-Lincoln-County-Wisconsin'))
  t.equal(doc.infobox().get('official_name').text(), 'Bradley, Wisconsin', 'official place name')
  t.equal(doc.infobox().get('settlement_type').text(), 'Unincorporated community', 'settlement type')
  t.end()
})

test('Britt-Morgan', (t) => {
  const doc = wtf(readPage('Britt-Morgan'))
  t.equal(doc.title(), 'Britt Morgan', 'article title')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas, United States', 'birthplace')
  t.ok(doc.links().some((link) => link.page() === 'Jace Rocker'), 'collaborator link')
  t.end()
})

test('Canton-Of-Etaples', (t) => {
  const doc = wtf(readPage('Canton-Of-Etaples'))
  t.equal(doc.infobox().get('name').text(), 'Canton of Étaples', 'accented canton name')
  t.equal(doc.infobox().get('dept').text(), 'Pas-de-Calais', 'department')
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
  t.end()
})

test('Clint-Murchison-Sr', (t) => {
  const doc = wtf(readPage('Clint-Murchison-Sr'))
  t.match(doc.title(), /Clinton Williams/, 'full name')
  t.ok(doc.citations().length > 0, 'biographical sources')
  t.end()
})

test('Damphu-Drum', (t) => {
  const doc = wtf(readPage('Damphu-Drum'))
  t.equal(doc.title(), 'Damphu', 'instrument name')
  t.ok(doc.links().some((link) => link.page() === 'percussion instrument'), 'instrument classification link')
  t.end()
})

test('Direct-Representation', (t) => {
  const doc = wtf(readPage('Direct-Representation'))
  t.equal(doc.title(), 'Direct representation', 'political concept')
  t.ok(doc.references().length > 0, 'references survive maintenance templates')
  t.end()
})

test('Dollar-Point-California', (t) => {
  const doc = wtf(readPage('Dollar-Point-California'))
  t.equal(doc.infobox().get('official_name').text(), 'Dollar Point, California', 'official name')
  t.equal(doc.coordinate().lat, 39.18861, 'latitude')
  t.equal(doc.coordinate().lon, -120.10889, 'longitude')
  t.end()
})

test('Elizabeth-Gilbert', (t) => {
  const doc = wtf(readPage('Elizabeth-Gilbert'))
  t.equal(doc.infobox().type(), 'writer', 'writer infobox')
  t.equal(doc.infobox().get('name').text(), 'Elizabeth Gilbert', 'writer name')
  t.end()
})

test('Ewelina-Setowska-Dryk', (t) => {
  const doc = wtf(readPage('Ewelina-Setowska-Dryk'))
  t.equal(doc.title(), 'Ewelina Sętowska-Dryk', 'accented athlete name')
  t.ok(doc.links().some((link) => link.page() === '800 metres'), 'running event link')
  t.end()
})

test('Goryeo-Ware', (t) => {
  const doc = wtf(readPage('Goryeo-Ware'))
  t.equal(doc.infobox().get('title').text(), 'Goryeo ware', 'ceramics name')
  t.equal(doc.images().length, 5, 'infobox and gallery images')
  t.end()
})

test('Gregory-Serper', (t) => {
  const doc = wtf(readPage('Gregory-Serper'))
  t.equal(doc.title(), 'Gregory Serper', 'chess player name')
  t.ok(doc.links().some((link) => link.page() === 'Grandmaster (chess)'), 'chess title link')
  t.end()
})

test('Groot-Brittanje', (t) => {
  const doc = wtf(readPage('Groot-Brittanje'))
  t.ok(doc.links().some((link) => link.page() === 'Verenigde Koninkryk'), 'Afrikaans UK link')
  t.match(doc.text(), /Groot-Brittanje/, 'Afrikaans island name')
  t.end()
})

test('HMS-Irresistible', (t) => {
  const doc = wtf(readPage('HMS-Irresistible'))
  t.equal(doc.title(), 'HMS Irresistible', 'ship name')
  t.ok(doc.links().some((link) => link.page() === 'Royal Navy'), 'navy link')
  t.ok(doc.lists().length > 0, 'list of ships')
  t.end()
})

test('Harry-McPherson', (t) => {
  const doc = wtf(readPage('Harry-McPherson'))
  t.equal(doc.infobox().get('name').text(), 'Harry McPherson', 'official name')
  t.equal(doc.infobox().get('office').text(), 'White House Counsel', 'office held')
  t.end()
})

test('History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales', (t) => {
  const doc = wtf(readPage('History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales'))
  t.ok(doc.links().some((link) => link.page() === 'Scotland national rugby union team'), 'Scotland team link')
  t.ok(doc.links().some((link) => link.page() === 'Wales national rugby union team'), 'Wales team link')
  t.ok(doc.tables().length > 0, 'match results tables')
  t.end()
})

test('Irina-Saratovtseva', (t) => {
  const doc = wtf(readPage('Irina-Saratovtseva'))
  t.equal(doc.infobox().get('fullname').text(), 'Irina Saratovtseva', 'player name')
  t.equal(doc.infobox().type(), 'football biography', 'football biography infobox')
  t.end()
})

test('Jerry-Mumphrey', (t) => {
  const doc = wtf(readPage('Jerry-Mumphrey'))
  t.equal(doc.infobox().get('position').text(), 'Outfielder', 'baseball position')
  t.equal(doc.infobox().get('bats').text(), 'Switch', 'batting side')
  t.end()
})

test('Jodie-Emery', (t) => {
  const doc = wtf(readPage('Jodie-Emery'))
  t.equal(doc.infobox().get('name').text(), 'Jodie Emery', 'person name')
  t.match(doc.image().file(), /Marc_Emery_and_Jodie_Emery\.JPG$/, 'portrait filename')
  t.end()
})

test('Julia-Kristeva', (t) => {
  const doc = wtf(readPage('Julia-Kristeva'))
  t.equal(doc.infobox().type(), 'philosopher', 'philosopher infobox')
  t.equal(doc.infobox().get('birth_name').text(), 'Юлия Кръстева', 'Cyrillic birth name')
  t.end()
})

test('K-Nicole-Mitchell', (t) => {
  const doc = wtf(readPage('K-Nicole-Mitchell'))
  t.equal(doc.infobox().get('name').text(), 'K. Nicole Mitchell', 'judge name')
  t.match(doc.infobox().get('office').text(), /Eastern District of Texas/, 'court jurisdiction')
  t.end()
})

test('Keilwelle', (t) => {
  const doc = wtf(readPage('Keilwelle'))
  t.ok(doc.images().length > 0, 'technical illustrations')
  t.ok(doc.images().some((image) => /Keilprofil-6K-Detail\.JPG$/.test(image.file())), 'shaft profile detail illustration')
  t.end()
})

test('Liste-Der-Argentinischen-Botschafter-In-Chile', (t) => {
  const doc = wtf(readPage('Liste-Der-Argentinischen-Botschafter-In-Chile'))
  t.ok(doc.tables().length > 0, 'ambassador chronology is parsed as a table')
  t.match(doc.text(), /Santiago/, 'embassy address')
  t.end()
})

test('Magnar-Saetre', (t) => {
  const doc = wtf(readPage('Magnar-Saetre'))
  t.equal(doc.title(), 'Magnar Sætre', 'Norwegian name')
  t.ok(doc.links().some((link) => link.page() === 'Bergen'), 'birthplace link')
  t.end()
})

test('Mark-Behr', (t) => {
  const doc = wtf(readPage('Mark-Behr'))
  t.equal(doc.infobox().get('naam').text(), 'Mark Behr', 'Afrikaans name field')
  t.equal(doc.infobox().get('geboortenaam').text(), 'Mark Carl Behr', 'Afrikaans birth name field')
  t.end()
})

test('Maurische-Netzwuhle', (t) => {
  const doc = wtf(readPage('Maurische-Netzwuhle'))
  t.match(doc.text(), /Blanus cinereus/, 'scientific species name')
  t.equal(doc.title(), 'Maurische Netzwühle', 'German species name')
  t.end()
})

test('Mozilla-Firefox', (t) => {
  const doc = wtf(readPage('Mozilla-Firefox'))
  t.match(doc.text(), /Firefox/, 'browser name')
  t.ok(doc.images().some((image) => /Firefox.*logo/i.test(image.file())), 'browser logo')
  t.end()
})

test('Neil-McLean-Saxophonist', (t) => {
  const doc = wtf(readPage('Neil-McLean-Saxophonist'))
  t.equal(doc.title(), 'Neil McLean', 'musician name')
  t.ok(doc.links().some((link) => link.page() === 'Ray Reach and Friends'), 'musical collaborators')
  t.end()
})

test('RNDIS', (t) => {
  const doc = wtf(readPage('RNDIS'))
  t.equal(doc.title(), 'Remote Network Driver Interface Specification (RNDIS)', 'expanded protocol name')
  t.ok(doc.links().some((link) => link.page() === 'USB'), 'transport link')
  t.end()
})

test('RNLI-Stations', (t) => {
  const doc = wtf(readPage('RNLI-Stations'))
  t.equal(doc.section('Key').title(), 'Key', 'table legend section')
  t.ok(doc.section('East Division').tables().length > 0, 'regional station table')
  t.end()
})

test('Raith-Rovers', (t) => {
  const doc = wtf(readPage('Raith-Rovers'))
  t.equal(doc.infobox().get('clubname').text(), 'Raith Rovers', 'club name')
  t.equal(doc.infobox().type(), 'football club', 'football club infobox')
  t.end()
})

test('Remote-Application-Programming-Interface', (t) => {
  const doc = wtf(readPage('Remote-Application-Programming-Interface'))
  t.equal(doc.title(), 'Remote Application Programming Interface', 'API name')
  t.ok(doc.links().some((link) => link.page() === 'Pocket PC'), 'server platform link')
  t.end()
})

test('Remote-Data-Objects', (t) => {
  const doc = wtf(readPage('Remote-Data-Objects'))
  t.equal(doc.title(), 'Remote Data Objects', 'technology name')
  t.ok(doc.links().some((link) => link.page() === 'Visual Basic'), 'programming language link')
  t.end()
})

test('Remote-Data-Services', (t) => {
  const doc = wtf(readPage('Remote-Data-Services'))
  t.equal(doc.title(), 'Remote Data Services', 'technology name')
  t.ok(doc.links().some((link) => link.page() === 'ActiveX Data Objects'), 'related technology link')
  t.end()
})

test('Routing-And-Remote-Access-Service', (t) => {
  const doc = wtf(readPage('Routing-And-Remote-Access-Service'))
  t.equal(doc.title(), 'Routing and Remote Access Service', 'service name')
  t.ok(doc.links().some((link) => link.page() === 'Router (computing)'), 'router link')
  t.end()
})

test('Royal-Cinema', (t) => {
  const doc = wtf(readPage('Royal-Cinema'))
  t.equal(doc.infobox().get('name').text(), 'Royal Cinema', 'venue name')
  t.equal(doc.infobox().get('former names').text(), 'The Pylon, The Golden Princess', 'former venue names')
  t.end()
})

test('Runtime-Callable-Wrapper', (t) => {
  const doc = wtf(readPage('Runtime-Callable-Wrapper'))
  t.equal(doc.title(), 'Runtime Callable Wrapper', 'wrapper name')
  t.ok(doc.links().some((link) => link.page() === 'Component Object Model'), 'COM link')
  t.end()
})

test('Sara-C-Bisel', (t) => {
  const doc = wtf(readPage('Sara-C-Bisel'))
  t.equal(doc.title(), 'Sara C. Bisel', 'archaeologist name')
  t.ok(doc.links().some((link) => link.page() === 'Archäologie'), 'German archaeology link')
  t.end()
})

test('Senate-Of-Pakistan', (t) => {
  const doc = wtf(readPage('Senate-Of-Pakistan'))
  t.equal(doc.infobox().type(), 'legislature', 'legislature infobox')
  t.equal(doc.infobox().get('name').text(), 'Senate of Pakistan', 'legislature name')
  t.end()
})

test('Statoil', (t) => {
  const doc = wtf(readPage('Statoil'))
  t.equal(doc.infobox().type(), 'verksemd', 'Nynorsk business infobox')
  t.equal(doc.infobox().get('namn').text(), 'Statoil ASA', 'Nynorsk company name field')
  t.end()
})

test('Terrence-Murphy-American-Football', (t) => {
  const doc = wtf(readPage('Terrence-Murphy-American-Football'))
  t.equal(doc.infobox().get('name').text(), 'Terrence Murphy', 'player name')
  t.equal(doc.infobox().get('position').text(), 'Wide receiver', 'football position')
  t.end()
})

test('Teymanak-E-Olya', (t) => {
  const doc = wtf(readPage('Teymanak-E-Olya'))
  t.equal(doc.infobox().get('official_name').text(), 'Teymanak-e Olya', 'village name')
  t.equal(doc.infobox().get('native_name').text(), 'تيمنك عليا', 'Persian village name')
  t.end()
})

test('The-Atlas-Newspaper', (t) => {
  const doc = wtf(readPage('The-Atlas-Newspaper'))
  t.equal(doc.title(), 'The Atlas', 'newspaper title')
  t.ok(doc.links().some((link) => link.page() === 'Robert Stephen Rintoul'), 'founder link')
  t.end()
})

test('The-Field-Of-Waterloo', (t) => {
  const doc = wtf(readPage('The-Field-Of-Waterloo'))
  t.equal(doc.title(), 'The Field of Waterloo', 'poem title')
  t.ok(doc.links().some((link) => link.page() === 'Sir Walter Scott'), 'poet link')
  t.end()
})

test('Toronto', (t) => {
  const doc = wtf(readPage('Toronto'))
  t.equal(doc.title(), 'Toronto', 'city title')
  t.ok(doc.links().some((link) => link.page() === 'Ontario'), 'province link')
  t.end()
})

test('Toronto-Star', (t) => {
  const doc = wtf(readPage('Toronto-Star'))
  t.equal(doc.infobox().type(), 'newspaper', 'newspaper infobox')
  t.equal(doc.infobox().get('publisher').text(), 'John D. Cruickshank', 'publisher in this snapshot')
  t.end()
})

test('Tour-EP-Band-Of-Horses-EP', (t) => {
  const doc = wtf(readPage('Tour-EP-Band-Of-Horses-EP'))
  t.equal(doc.infobox().get('name').text(), 'Tour EP', 'release title')
  t.equal(doc.infobox().get('artist').text(), 'Band of Horses', 'performing artist')
  t.end()
})

test('United-Kingdom', (t) => {
  const doc = wtf(readPage('United-Kingdom'))
  t.match(doc.title(), /United Kingdom/, 'country title')
  t.ok(doc.links().some((link) => link.page() === 'London'), 'capital city link')
  t.end()
})

test('University-Of-Nevada-Reno-Arboretum', (t) => {
  const doc = wtf(readPage('University-Of-Nevada-Reno-Arboretum'))
  t.equal(doc.title(), 'University of Nevada, Reno Arboretum', 'arboretum name')
  t.ok(doc.coordinates().length > 0, 'arboretum location')
  t.end()
})

test('Wendy-Mogel', (t) => {
  const doc = wtf(readPage('Wendy-Mogel'))
  t.equal(doc.title(), 'Wendy Mogel', 'psychologist name')
  t.ok(doc.links().some((link) => link.page() === 'Klinische Psychologie'), 'German clinical psychology link')
  t.end()
})
