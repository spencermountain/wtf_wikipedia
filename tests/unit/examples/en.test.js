import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('2008-British-Motorcycle-Grand-Prix', (t) => {
  const doc = wtf(readPage('2008-British-Motorcycle-Grand-Prix'))
  t.equal(doc.infobox().get('Grand Prix').text(), 'British', '2008-British-Motorcycle-Grand-Prix: race location')
  t.equal(doc.infobox().get('Location').text(), 'Donington Park', '2008-British-Motorcycle-Grand-Prix: race circuit')
  t.equal(
    doc.infobox().get('Official_Name').text(),
    'bwin.com British Grand Prix',
    '2008-British-Motorcycle-Grand-Prix: official race name'
  )
  t.equal(doc.infobox().get('flag').text(), 'UK', '2008-British-Motorcycle-Grand-Prix: host country code')
  t.ok(doc.tables().length > 0, '2008-British-Motorcycle-Grand-Prix: race standings tables')
  t.ok(
    doc.categories().includes('British motorcycle Grand Prix'),
    '2008-British-Motorcycle-Grand-Prix: British motorcycle Grand Prix category'
  )
  t.ok(
    doc.links().some((link) => link.page() === '2008 Grand Prix motorcycle racing season'),
    '2008-British-Motorcycle-Grand-Prix: 2008 Grand Prix motorcycle racing season link'
  )
  t.end()
})

test('AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft', (t) => {
  const doc = wtf(readPage('AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft'))
  t.equal(
    doc.infobox().type(),
    'award',
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: award infobox'
  )
  t.match(
    doc.infobox().get('presenter').text(),
    /Australian Academy of Cinema and Television Arts/,
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: presenting organization'
  )
  t.match(
    doc.infobox().get('name').text(),
    /Outstanding Achievement in Short Film Screen Craft/,
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: award name'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'AACTA Awards'),
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: parent awards link'
  )
  t.ok(
    doc.tables().length > 0,
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: award recipients table'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Australian Film Institute'),
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: Australian Film Institute link'
  )
  t.ok(doc.section('Winners'), 'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: Winners section')
  t.end()
})

test('Al-Haytham', (t) => {
  const doc = wtf(readPage('Al-Haytham'))
  t.equal(doc.infobox().type(), 'scientist', 'Al-Haytham: scientist infobox')
  t.match(doc.text(), /optics/i, 'Al-Haytham: scientific work appears in the article')
  t.match(doc.infobox().get('name').text(), /Hasan Ibn al-Haytham/, 'Al-Haytham: scientist name')
  t.ok(doc.references().length > 0, 'Al-Haytham: scientific biography sources')
  t.match(doc.text(), /Book of Optics/, 'Al-Haytham: principal work')
  t.ok(doc.section('Biography'), 'Al-Haytham: Biography section')
  t.ok(
    doc.links().some((link) => link.page() === 'Basra'),
    'Al-Haytham: birth city link'
  )
  t.end()
})

test('Alanine-Oxo-Acid-Transaminase', (t) => {
  const doc = wtf(readPage('Alanine-Oxo-Acid-Transaminase'))
  t.equal(doc.title, 'alanine-oxo-acid transaminase', 'Alanine-Oxo-Acid-Transaminase: enzyme title')
  t.ok(
    doc.links().some((link) => link.page() === 'enzymology'),
    'Alanine-Oxo-Acid-Transaminase: enzymology link'
  )
  t.match(doc.text(), /enzyme/i, 'Alanine-Oxo-Acid-Transaminase: biochemical role')
  t.ok(
    doc.categories().some((category) => /EC 2\.6\.1/.test(category)),
    'Alanine-Oxo-Acid-Transaminase: enzyme classification category'
  )
  t.ok(doc.references().length > 0, 'Alanine-Oxo-Acid-Transaminase: research references')
  t.ok(
    doc.links().some((link) => link.page() === 'pyridoxal phosphate'),
    'Alanine-Oxo-Acid-Transaminase: enzyme cofactor link'
  )
  t.ok(doc.categories().includes('EC 2.6.1'), 'Alanine-Oxo-Acid-Transaminase: EC 2.6.1 category')
  t.end()
})

test('Alexander-Y-Type', (t) => {
  const doc = wtf(readPage('Alexander-Y-Type'))
  t.match(doc.infobox().get('name').text(), /Alexander Y Type/, 'Alexander-Y-Type: bus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Leyland Leopard'),
    'Alexander-Y-Type: bus chassis link'
  )
  t.equal(doc.infobox().type(), 'uk bus', 'Alexander-Y-Type: bus infobox')
  t.match(doc.image().file(), /LeylandLeopardAlexanderYType/, 'Alexander-Y-Type: vehicle photograph')
  t.match(doc.text(), /Walter Alexander/, 'Alexander-Y-Type: body manufacturer')
  t.ok(doc.categories().includes('Alexander Dennis buses'), 'Alexander-Y-Type: Alexander Dennis buses category')
  t.ok(
    doc.links().some((link) => link.page() === 'single-decker bus'),
    'Alexander-Y-Type: single-decker bus link'
  )
  t.end()
})

test('Allen-R-Morris', (t) => {
  const doc = wtf(readPage('Allen-R-Morris'))
  t.equal(doc.infobox().get('birth_name').text(), 'Allen Robert Morris', 'Allen-R-Morris: birth name')
  t.match(doc.image().file(), /AllenMorrisHeadShot\.jpg$/, 'Allen-R-Morris: portrait filename')
  t.equal(doc.infobox().type(), 'person', 'Allen-R-Morris: biography infobox')
  t.match(doc.text(), /Emmy/, 'Allen-R-Morris: television awards')
  t.ok(doc.citations().length > 0, 'Allen-R-Morris: career sources')
  t.ok(
    doc.links().some((link) => link.page() === 'Lufkin, Texas'),
    'Allen-R-Morris: Lufkin, Texas link'
  )
  t.ok(doc.section('Early life'), 'Allen-R-Morris: Early life section')
  t.end()
})

test('Alsea-Company', (t) => {
  const doc = wtf(readPage('Alsea-Company'))
  t.equal(doc.infobox().type(), 'company', 'Alsea-Company: company infobox')
  t.match(doc.infobox().get('name').text(), /Alsea/, 'Alsea-Company: company name')
  t.equal(doc.infobox().get('industry').text(), 'Restaurants', 'Alsea-Company: business sector')
  t.equal(doc.infobox().get('type').text(), 'Public', 'Alsea-Company: company ownership type')
  t.ok(
    doc.links().some((link) => link.page() === 'Public Company'),
    'Alsea-Company: ownership link'
  )
  t.ok(doc.section('Brands portfolio'), 'Alsea-Company: Brands portfolio section')
  t.ok(
    doc.infoboxes().some((box) => box.get('name').text() === 'Alsea, S.A.B. de C.V.'),
    'Alsea-Company: name field'
  )
  t.end()
})

test('Altimont-Butler', (t) => {
  const doc = wtf(readPage('Altimont-Butler'))
  t.equal(doc.infobox().get('fullname').text(), 'Altimont Butler', 'Altimont-Butler: full name')
  t.equal(doc.infobox().get('name').text(), 'Freddie Butler', 'Altimont-Butler: playing name')
  t.equal(doc.infobox().type(), 'football biography', 'Altimont-Butler: player infobox')
  t.match(doc.text(), /Jamaica/, 'Altimont-Butler: national team')
  t.ok(doc.references().length > 0, 'Altimont-Butler: football career references')
  t.ok(
    doc.infoboxes().some((box) => box.get('years1').text() === '1984–1987'),
    'Altimont-Butler: years1 field'
  )
  t.ok(doc.categories().includes('1968 births'), 'Altimont-Butler: 1968 births category')
  t.end()
})

test('Anarchism', (t) => {
  const doc = wtf(readPage('Anarchism'))
  t.equal(doc.title, 'Anarchism', 'Anarchism: article title')
  t.ok(doc.lists().length > 0, 'Anarchism: article includes lists')
  t.match(doc.sentence().text(), /political philosophy/, 'Anarchism: opening definition')
  t.ok(doc.section('History'), 'Anarchism: history section')
  t.ok(doc.references().length > 0, 'Anarchism: historical sources')
  t.ok(doc.categories().includes('Political culture'), 'Anarchism: Political culture category')
  t.ok(
    doc.links().some((link) => link.page() === 'stateless society'),
    'Anarchism: stateless society link'
  )
  t.end()
})

test('Antique-Band', (t) => {
  const doc = wtf(readPage('Antique-Band'))
  t.equal(doc.infobox().type(), 'musical artist', 'Antique-Band: musical artist infobox')
  t.match(doc.infobox().get('origin').text(), /Stockholm/, 'Antique-Band: band origin')
  t.equal(doc.infobox().get('Name').text(), 'Antique', 'Antique-Band: band name')
  t.match(doc.text(), /Elena Paparizou/, 'Antique-Band: band vocalist')
  t.match(doc.text(), /Eurovision/, 'Antique-Band: song contest participation')
  t.ok(
    doc.links().some((link) => link.page() === 'Sweden'),
    'Antique-Band: Sweden link'
  )
  t.ok(doc.section('Career'), 'Antique-Band: Career section')
  t.end()
})

test('Anwar-Kamal-Khan', (t) => {
  const doc = wtf(readPage('Anwar-Kamal-Khan'))
  t.match(doc.title, /Anwar Kamal Khan/, 'Anwar-Kamal-Khan: politician name')
  t.match(doc.text(), /Pakistani Politician/i, 'Anwar-Kamal-Khan: occupation')
  t.match(doc.text(), /1946/, 'Anwar-Kamal-Khan: birth year')
  t.match(doc.text(), /2012/, 'Anwar-Kamal-Khan: death year')
  t.ok(
    doc.references().some((reference) => /Marwat|leader|Anwar/i.test(reference.title())),
    'Anwar-Kamal-Khan: biographical reference title'
  )
  t.ok(doc.categories().includes('1946 births'), 'Anwar-Kamal-Khan: 1946 births category')
  t.ok(
    doc.links().some((link) => link.page() === 'Pakistan Muslim League (N)'),
    'Anwar-Kamal-Khan: Pakistan Muslim League (N) link'
  )
  t.end()
})

test('Arts-Club-Of-Chicago', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.image().file(), 'File:20070701_Arts_Club_of_Chicago.JPG', 'Arts-Club-Of-Chicago: club image')
  t.ok(doc.tables().length > 0, 'Arts-Club-Of-Chicago: article tables survive parsing')
  t.equal(doc.template(1).json().template, 'good article', 'Arts-Club-Of-Chicago: article quality template')
  t.ok(doc.references().length > 0, 'Arts-Club-Of-Chicago: art history sources')
  t.match(doc.text(), /1916/, 'Arts-Club-Of-Chicago: founding year')
  t.ok(
    doc.infoboxes().some((box) => box.get('name').text() === 'Arts Club of Chicago'),
    'Arts-Club-Of-Chicago: name field'
  )
  t.ok(
    doc.categories().includes('1916 establishments in Illinois'),
    'Arts-Club-Of-Chicago: 1916 establishments in Illinois category'
  )
  t.end()
})

test('Bodmin', (t) => {
  const doc = wtf(readPage('Bodmin'))
  t.equal(doc.infobox().type(), 'uk place', 'Bodmin: UK place infobox')
  t.match(doc.text(), /Cornwall/, 'Bodmin: location in Cornwall')
  t.ok(doc.section('History'), 'Bodmin: town history section')
  t.match(doc.infobox().get('static_image_name').text(), /Bodmin Public Rooms/, 'Bodmin: town photograph field')
  t.ok(
    doc.categories().some((category) => /Cornwall/.test(category)),
    'Bodmin: Cornwall category'
  )
  t.ok(doc.categories().includes('Towns in Cornwall'), 'Bodmin: Towns in Cornwall category')
  t.ok(
    doc.links().some((link) => link.page() === 'civil parishes in England'),
    'Bodmin: civil parishes in England link'
  )
  t.end()
})

test('Bradley-Community-Lincoln-County-Wisconsin', (t) => {
  const doc = wtf(readPage('Bradley-Community-Lincoln-County-Wisconsin'))
  t.equal(
    doc.infobox().get('official_name').text(),
    'Bradley, Wisconsin',
    'Bradley-Community-Lincoln-County-Wisconsin: official place name'
  )
  t.equal(
    doc.infobox().get('settlement_type').text(),
    'Unincorporated community',
    'Bradley-Community-Lincoln-County-Wisconsin: settlement type'
  )
  t.equal(doc.infobox().type(), 'settlement', 'Bradley-Community-Lincoln-County-Wisconsin: settlement infobox')
  t.match(doc.text(), /Lincoln County/, 'Bradley-Community-Lincoln-County-Wisconsin: county location')
  t.ok(doc.coordinates().length > 0, 'Bradley-Community-Lincoln-County-Wisconsin: community coordinates')
  t.ok(
    doc.links().some((link) => link.page() === 'Unincorporated area'),
    'Bradley-Community-Lincoln-County-Wisconsin: Unincorporated area link'
  )
  t.ok(
    doc.infoboxes().some((box) => box.get('utc_offset').text() === '-6'),
    'Bradley-Community-Lincoln-County-Wisconsin: utc_offset field'
  )
  t.end()
})

test('Britt-Morgan', (t) => {
  const doc = wtf(readPage('Britt-Morgan'))
  t.equal(doc.title, 'Britt Morgan', 'Britt-Morgan: article title')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas, United States', 'Britt-Morgan: birthplace')
  t.ok(
    doc.links().some((link) => link.page() === 'Jace Rocker'),
    'Britt-Morgan: collaborator link'
  )
  t.equal(doc.infobox().type(), 'adult biography', 'Britt-Morgan: biography type')
  t.ok(doc.section('Awards'), 'Britt-Morgan: awards section')
  t.ok(
    doc
      .infoboxes()
      .some((box) => box.get('alias').text() === 'Brittney Morgan, Brittany Morgan, Jacy Bodean, Brit Morgan'),
    'Britt-Morgan: alias field'
  )
  t.ok(
    doc.categories().includes('American pornographic film actresses'),
    'Britt-Morgan: American pornographic film actresses category'
  )
  t.end()
})

test('Canton-Of-Etaples', (t) => {
  const doc = wtf(readPage('Canton-Of-Etaples'))
  t.equal(doc.infobox().get('name').text(), 'Canton of Étaples', 'Canton-Of-Etaples: accented canton name')
  t.equal(doc.infobox().get('dept').text(), 'Pas-de-Calais', 'Canton-Of-Etaples: department')
  t.equal(doc.infobox().get('chief town').text(), 'Étaples', 'Canton-Of-Etaples: administrative seat')
  t.equal(doc.infobox().get('numcomm').text(), '15', 'Canton-Of-Etaples: number of communes')
  t.equal(doc.infobox().get('cancode').text(), '6224', 'Canton-Of-Etaples: canton code')
  t.ok(
    doc.infoboxes().some((box) => box.get('arr').text() === 'Montreuil'),
    'Canton-Of-Etaples: arr field'
  )
  t.ok(doc.categories().includes('Cantons of Pas-de-Calais'), 'Canton-Of-Etaples: Cantons of Pas-de-Calais category')
  t.end()
})

test('Charlie-Milstead', (t) => {
  const doc = wtf(readPage('Charlie-Milstead'))
  t.equal(doc.title, 'Charles Frank Milstead', 'Charlie-Milstead: title')
  t.equal(doc.infoboxes().length, 1, 'Charlie-Milstead: infoboxes')
  t.equal(doc.categories().length, 9, 'Charlie-Milstead: categories')
  t.equal(doc.infobox().type(), 'nfl biography', 'Charlie-Milstead: infobox type')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas', 'Charlie-Milstead: birthplace')
  t.equal(doc.templates('1960 Houston Oilers').length, 1, 'Charlie-Milstead: team roster template')
  t.ok(doc.categories().includes('1937 births'), 'Charlie-Milstead: 1937 births category')
  t.ok(
    doc.links().some((link) => link.page() === 'American football'),
    'Charlie-Milstead: American football link'
  )
  t.end()
})

test('Chemical-Biology', (t) => {
  const doc = wtf(readPage('Chemical-Biology'))
  t.equal(doc.title, 'Chemical biology', 'Chemical-Biology: discipline title')
  t.ok(
    doc.links().some((link) => link.page() === 'chemistry'),
    'Chemical-Biology: related discipline link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'biology'),
    'Chemical-Biology: biology link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'physics'),
    'Chemical-Biology: physics link'
  )
  t.ok(doc.references().length > 0, 'Chemical-Biology: scientific sources')
  t.ok(
    doc.links().some((link) => link.page() === 'chemical synthesis'),
    'Chemical-Biology: chemical synthesis link'
  )
  t.ok(doc.section('Introduction'), 'Chemical-Biology: Introduction section')
  t.end()
})

test('Clint-Murchison-Sr', (t) => {
  const doc = wtf(readPage('Clint-Murchison-Sr'))
  t.match(doc.title, /Clinton Williams/, 'Clint-Murchison-Sr: full name')
  t.ok(doc.citations().length > 0, 'Clint-Murchison-Sr: biographical sources')
  t.match(doc.text(), /1895/, 'Clint-Murchison-Sr: birth year')
  t.match(doc.text(), /1969/, 'Clint-Murchison-Sr: death year')
  t.ok(
    doc.categories().some((category) => /Texas/.test(category)),
    'Clint-Murchison-Sr: Texas connection'
  )
  t.ok(doc.section('Personal'), 'Clint-Murchison-Sr: Personal section')
  t.ok(
    doc.categories().includes('American businesspeople in the oil industry'),
    'Clint-Murchison-Sr: American businesspeople in the oil industry category'
  )
  t.end()
})

test('Damphu-Drum', (t) => {
  const doc = wtf(readPage('Damphu-Drum'))
  t.equal(doc.title, 'Damphu', 'Damphu-Drum: instrument name')
  t.ok(
    doc.links().some((link) => link.page() === 'percussion instrument'),
    'Damphu-Drum: instrument classification link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'tambourine'),
    'Damphu-Drum: related instrument link'
  )
  t.match(doc.image().file(), /Damfu[ _]nepal\.jpg$/, 'Damphu-Drum: performance photograph')
  t.match(doc.text(), /Nepal/, 'Damphu-Drum: musical tradition')
  t.ok(doc.categories().includes('Nepalese musical instruments'), 'Damphu-Drum: Nepalese musical instruments category')
  t.ok(
    doc.links().some((link) => link.page() === 'Himalayan monal'),
    'Damphu-Drum: Himalayan monal link'
  )
  t.end()
})

test('Direct-Representation', (t) => {
  const doc = wtf(readPage('Direct-Representation'))
  t.equal(doc.title, 'Direct representation', 'Direct-Representation: political concept')
  t.ok(doc.references().length > 0, 'Direct-Representation: references survive maintenance templates')
  t.match(doc.text(), /representative/i, 'Direct-Representation: representation explanation')
  t.ok(doc.sections().length > 1, 'Direct-Representation: concept is divided into sections')
  t.ok(
    doc.categories().some((category) => /politic|democra|government/i.test(category)),
    'Direct-Representation: political category'
  )
  t.ok(doc.categories().includes('Electoral systems'), 'Direct-Representation: Electoral systems category')
  t.ok(
    doc.links().some((link) => link.page() === 'representative democracy'),
    'Direct-Representation: representative democracy link'
  )
  t.end()
})

test('Dollar-Point-California', (t) => {
  const doc = wtf(readPage('Dollar-Point-California'))
  t.equal(
    doc.infobox().get('official_name').text(),
    'Dollar Point, California',
    'Dollar-Point-California: official name'
  )
  t.equal(doc.coordinate().lat, 39.18861, 'Dollar-Point-California: latitude')
  t.equal(doc.coordinate().lon, -120.10889, 'Dollar-Point-California: longitude')
  t.equal(
    doc.infobox().get('settlement_type').text(),
    'census-designated place',
    'Dollar-Point-California: settlement classification'
  )
  t.ok(doc.section('Demographics'), 'Dollar-Point-California: population section')
  t.ok(
    doc.links().some((link) => link.page() === 'Placer County, California'),
    'Dollar-Point-California: Placer County, California link'
  )
  t.ok(doc.section('History'), 'Dollar-Point-California: History section')
  t.end()
})

test('Elizabeth-Gilbert', (t) => {
  const doc = wtf(readPage('Elizabeth-Gilbert'))
  t.equal(doc.infobox().type(), 'writer', 'Elizabeth-Gilbert: writer infobox')
  t.equal(doc.infobox().get('name').text(), 'Elizabeth Gilbert', 'Elizabeth-Gilbert: writer name')
  t.match(doc.text(), /Eat, Pray, Love/, 'Elizabeth-Gilbert: best-known book')
  t.match(doc.image().file(), /Elizabeth[ _]Gilbert[ _]at[ _]TED\.jpg$/, 'Elizabeth-Gilbert: author photograph')
  t.ok(doc.references().length > 0, 'Elizabeth-Gilbert: biographical sources')
  t.ok(doc.section('Early life'), 'Elizabeth-Gilbert: Early life section')
  t.ok(
    doc.infoboxes().some((box) => box.get('occupation').text() === 'Novelist, memoirist'),
    'Elizabeth-Gilbert: occupation field'
  )
  t.end()
})

test('Ewelina-Setowska-Dryk', (t) => {
  const doc = wtf(readPage('Ewelina-Setowska-Dryk'))
  t.equal(doc.title, 'Ewelina Sętowska-Dryk', 'Ewelina-Setowska-Dryk: accented athlete name')
  t.ok(
    doc.links().some((link) => link.page() === '800 metres'),
    'Ewelina-Setowska-Dryk: running event link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Puławy'),
    'Ewelina-Setowska-Dryk: birthplace link'
  )
  t.match(doc.text(), /1980/, 'Ewelina-Setowska-Dryk: birth year')
  t.ok(
    doc.links().some((link) => link.page() === '2005 Summer Universiade'),
    'Ewelina-Setowska-Dryk: competition link'
  )
  t.ok(doc.categories().includes('1980 births'), 'Ewelina-Setowska-Dryk: 1980 births category')
  t.ok(
    doc.links().some((link) => link.page() === 'Poland'),
    'Ewelina-Setowska-Dryk: Poland link'
  )
  t.end()
})

test('Goryeo-Ware', (t) => {
  const doc = wtf(readPage('Goryeo-Ware'))
  t.equal(doc.infobox().get('title').text(), 'Goryeo ware', 'Goryeo-Ware: ceramics name')
  t.equal(doc.images().length, 5, 'Goryeo-Ware: infobox and gallery images')
  t.equal(doc.infobox().type(), 'korean name', 'Goryeo-Ware: Korean name infobox')
  t.ok(
    doc.links().some((link) => link.page() === 'Goryeo dynasty'),
    'Goryeo-Ware: dynasty link'
  )
  t.match(doc.text(), /celadon/i, 'Goryeo-Ware: ceramic glaze')
  t.ok(doc.categories().includes('Korean pottery'), 'Goryeo-Ware: Korean pottery category')
  t.ok(
    doc.links().some((link) => link.page() === 'Korean pottery'),
    'Goryeo-Ware: Korean pottery link'
  )
  t.end()
})

test('Gregory-Serper', (t) => {
  const doc = wtf(readPage('Gregory-Serper'))
  t.equal(doc.title, 'Gregory Serper', 'Gregory-Serper: chess player name')
  t.ok(
    doc.links().some((link) => link.page() === 'Grandmaster (chess)'),
    'Gregory-Serper: chess title link'
  )
  t.match(doc.text(), /1969/, 'Gregory-Serper: birth year')
  t.ok(
    doc.links().some((link) => link.page() === 'chess'),
    'Gregory-Serper: sport link'
  )
  t.ok(
    doc.references().some((reference) => /FIDE/.test(reference.wikitext())),
    'Gregory-Serper: chess federation reference'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Tashkent'),
    'Gregory-Serper: Tashkent link'
  )
  t.ok(doc.section('Notable game'), 'Gregory-Serper: Notable game section')
  t.end()
})

test('Harry-McPherson', (t) => {
  const doc = wtf(readPage('Harry-McPherson'))
  t.equal(doc.infobox().get('name').text(), 'Harry McPherson', 'Harry-McPherson: official name')
  t.equal(doc.infobox().get('office').text(), 'White House Counsel', 'Harry-McPherson: office held')
  t.equal(doc.infobox().type(), 'officeholder', 'Harry-McPherson: political office infobox')
  t.match(doc.infobox().get('president').text(), /Lyndon Johnson/, 'Harry-McPherson: president served')
  t.match(doc.image().file(), /McPherson[ _]DLA[ _]Piper\.jpg$/, 'Harry-McPherson: portrait')
  t.ok(
    doc.section('Early life, education, military service'),
    'Harry-McPherson: Early life, education, military service section'
  )
  t.ok(
    doc.infoboxes().some((box) => box.get('term_start').text() === 'February 11, 1966'),
    'Harry-McPherson: term_start field'
  )
  t.end()
})

test('History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales', (t) => {
  const doc = wtf(readPage('History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales'))
  t.ok(
    doc.links().some((link) => link.page() === 'Scotland national rugby union team'),
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: Scotland team link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Wales national rugby union team'),
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: Wales team link'
  )
  t.ok(doc.tables().length > 0, 'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: match results tables')
  t.match(
    doc.sentence().text(),
    /1883/,
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: start of the rivalry'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'rugby union'),
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: sport link'
  )
  t.ok(
    doc.categories().includes('Rugby union rivalries'),
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: Rugby union rivalries category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Six Nations Championship'),
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: Six Nations Championship link'
  )
  t.end()
})

test('Irina-Saratovtseva', (t) => {
  const doc = wtf(readPage('Irina-Saratovtseva'))
  t.equal(doc.infobox().get('fullname').text(), 'Irina Saratovtseva', 'Irina-Saratovtseva: player name')
  t.equal(doc.infobox().type(), 'football biography', 'Irina-Saratovtseva: football biography infobox')
  t.equal(doc.infobox().get('name').text(), 'Irina Saratovtseva', 'Irina-Saratovtseva: display name')
  t.match(doc.image().file(), /ISaratovtseva\.JPG$/, 'Irina-Saratovtseva: player photograph')
  t.match(doc.text(), /goalkeeper/i, 'Irina-Saratovtseva: playing position')
  t.ok(doc.categories().includes('1989 births'), 'Irina-Saratovtseva: 1989 births category')
  t.ok(
    doc.links().some((link) => link.page() === 'Kazakhstan'),
    'Irina-Saratovtseva: Kazakhstan link'
  )
  t.end()
})

test('Jerry-Mumphrey', (t) => {
  const doc = wtf(readPage('Jerry-Mumphrey'))
  t.equal(doc.infobox().get('position').text(), 'Outfielder', 'Jerry-Mumphrey: baseball position')
  t.equal(doc.infobox().get('bats').text(), 'Switch', 'Jerry-Mumphrey: batting side')
  t.equal(doc.infobox().get('throws').text(), 'Right', 'Jerry-Mumphrey: throwing arm')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas', 'Jerry-Mumphrey: birthplace')
  t.equal(doc.infobox().type(), 'baseball biography', 'Jerry-Mumphrey: baseball biography type')
  t.ok(
    doc.links().some((link) => link.page() === 'Major League Baseball'),
    'Jerry-Mumphrey: Major League Baseball link'
  )
  t.ok(doc.section('Personal life'), 'Jerry-Mumphrey: Personal life section')
  t.end()
})

test('Jodie-Emery', (t) => {
  const doc = wtf(readPage('Jodie-Emery'))
  t.equal(doc.infobox().get('name').text(), 'Jodie Emery', 'Jodie-Emery: person name')
  t.match(doc.image().file(), /Marc_Emery_and_Jodie_Emery\.JPG$/, 'Jodie-Emery: portrait filename')
  t.equal(doc.infobox().type(), 'person', 'Jodie-Emery: person infobox')
  t.equal(doc.infobox().get('nationality').text(), 'Canadian', 'Jodie-Emery: nationality')
  t.match(doc.infobox().get('caption').text(), /Toronto Freedom Festival 2010/, 'Jodie-Emery: photo caption')
  t.equal(doc.isRedirect(), false, 'Jodie-Emery: not-redirect')
  t.equal(doc.infobox().data.nationality.text(), 'Canadian', 'Jodie-Emery: nationality')
  t.equal(doc.infobox().template(), 'person', 'Jodie-Emery: person template')
  t.equal(doc.section().sentences().length > 0, true, 'Jodie-Emery: intro-length')
  t.equal(doc.section(1).sentences().length > 0, true, 'Jodie-Emery: career-length')
  t.equal(doc.categories().length, 8, 'Jodie-Emery: cat-length')
  t.equal(doc.images().length, 1, 'Jodie-Emery: image-length')
  t.ok(doc.section('Early life'), 'Jodie-Emery: Early life section')
  t.ok(
    doc.infoboxes().some((box) => box.get('other_names').text() === 'Princess of Pot'),
    'Jodie-Emery: other_names field'
  )
  t.end()
})

test('Julia-Kristeva', (t) => {
  const doc = wtf(readPage('Julia-Kristeva'))
  t.equal(doc.infobox().type(), 'philosopher', 'Julia-Kristeva: philosopher infobox')
  t.equal(doc.infobox().get('birth_name').text(), 'Юлия Кръстева', 'Julia-Kristeva: Cyrillic birth name')
  t.equal(doc.infobox().get('name').text(), 'Julia Kristeva', 'Julia-Kristeva: display name')
  t.match(doc.text(), /psychoanalyst/i, 'Julia-Kristeva: profession')
  t.match(doc.image().file(), /Kristeva/, 'Julia-Kristeva: portrait filename')
  t.ok(
    doc.infoboxes().some((box) => box.get('residence').text() === 'France'),
    'Julia-Kristeva: residence field'
  )
  t.ok(doc.categories().includes('1941 births'), 'Julia-Kristeva: 1941 births category')
  t.end()
})

test('K-Nicole-Mitchell', (t) => {
  const doc = wtf(readPage('K-Nicole-Mitchell'))
  t.equal(doc.infobox().get('name').text(), 'K. Nicole Mitchell', 'K-Nicole-Mitchell: judge name')
  t.match(doc.infobox().get('office').text(), /Eastern District of Texas/, 'K-Nicole-Mitchell: court jurisdiction')
  t.equal(doc.infobox().type(), 'judge', 'K-Nicole-Mitchell: judge infobox')
  t.match(doc.infobox().get('termstart').text(), /2013/, 'K-Nicole-Mitchell: start of judicial term')
  t.match(doc.text(), /Magistrate Judge/i, 'K-Nicole-Mitchell: judicial role')
  t.ok(doc.categories().includes('American lawyers'), 'K-Nicole-Mitchell: American lawyers category')
  t.ok(
    doc.links().some((link) => link.page() === 'U.S. Magistrate Judge'),
    'K-Nicole-Mitchell: U.S. Magistrate Judge link'
  )
  t.end()
})

test('Magnar-Saetre', (t) => {
  const doc = wtf(readPage('Magnar-Saetre'))
  t.equal(doc.title, 'Magnar Sætre', 'Magnar-Saetre: Norwegian name')
  t.ok(
    doc.links().some((link) => link.page() === 'Bergen'),
    'Magnar-Saetre: birthplace link'
  )
  t.match(doc.text(), /Norwegian politician/, 'Magnar-Saetre: occupation')
  t.ok(
    doc.links().some((link) => link.page() === 'Norwegian Labour Party'),
    'Magnar-Saetre: political party link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Stortinget'),
    'Magnar-Saetre: parliament link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Rogaland'),
    'Magnar-Saetre: Rogaland link'
  )
  t.ok(doc.categories().includes('1940 births'), 'Magnar-Saetre: 1940 births category')
  t.end()
})

test('Neil-McLean-Saxophonist', (t) => {
  const doc = wtf(readPage('Neil-McLean-Saxophonist'))
  t.equal(doc.title, 'Neil McLean', 'Neil-McLean-Saxophonist: musician name')
  t.ok(
    doc.links().some((link) => link.page() === 'Ray Reach and Friends'),
    'Neil-McLean-Saxophonist: musical collaborators'
  )
  t.match(doc.sentence().text(), /American saxophonist/, 'Neil-McLean-Saxophonist: occupation')
  t.match(doc.text(), /Tyler, Texas/, 'Neil-McLean-Saxophonist: residence')
  t.ok(
    doc.links().some((link) => link.type() === 'external'),
    'Neil-McLean-Saxophonist: external jazz ensemble link'
  )
  t.ok(doc.section('Selected discography'), 'Neil-McLean-Saxophonist: Selected discography section')
  t.ok(doc.categories().includes('American saxophonists'), 'Neil-McLean-Saxophonist: American saxophonists category')
  t.end()
})

test('RNDIS', (t) => {
  const doc = wtf(readPage('RNDIS'))
  t.equal(doc.title, 'Remote Network Driver Interface Specification (RNDIS)', 'RNDIS: expanded protocol name')
  t.ok(
    doc.links().some((link) => link.page() === 'USB'),
    'RNDIS: transport link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Microsoft'),
    'RNDIS: protocol vendor link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Ethernet'),
    'RNDIS: network interface link'
  )
  t.match(doc.text(), /proprietary protocol/, 'RNDIS: protocol description')
  t.ok(
    doc.categories().includes('Microsoft application programming interfaces'),
    'RNDIS: Microsoft application programming interfaces category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Microsoft Windows'),
    'RNDIS: Microsoft Windows link'
  )
  t.end()
})

test('RNLI-Stations', (t) => {
  const doc = wtf(readPage('RNLI-Stations'))
  t.equal(doc.section('Key').title(), 'Key', 'RNLI-Stations: table legend section')
  t.ok(doc.section('East Division').tables().length > 0, 'RNLI-Stations: regional station table')
  t.equal(doc.categories().length, 5, 'RNLI-Stations: station list categories')
  t.ok(
    doc.images().some((image) => /Tenby/.test(image.file())),
    'RNLI-Stations: Tenby lifeboat station photograph'
  )
  t.equal(doc.section('East Division').indentation(), 1, 'RNLI-Stations: regional section depth')
  t.ok(doc.categories().includes('Ireland-related lists'), 'RNLI-Stations: Ireland-related lists category')
  t.ok(
    doc.links().some((link) => link.page() === 'Royal National Lifeboat Institution'),
    'RNLI-Stations: Royal National Lifeboat Institution link'
  )
  t.end()
})

test('Radiohead', (t) => {
  const doc = wtf(readPage('Radiohead'))
  t.match(doc.text(), /Radiohead/, 'Radiohead: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Thom Yorke'),
    'Radiohead: lead singer link'
  )
  t.ok(doc.section('History'), 'Radiohead: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead: sources for the band history')
  t.ok(
    doc.links().some((link) => link.page() === 'Rock music'),
    'Radiohead: Rock music link'
  )
  t.ok(doc.section('1985–1992: Formation and first years'), 'Radiohead: 1985–1992: Formation and first years section')
  t.end()
})

test('Raith-Rovers', (t) => {
  const doc = wtf(readPage('Raith-Rovers'))
  t.equal(doc.infobox().get('clubname').text(), 'Raith Rovers', 'Raith-Rovers: club name')
  t.equal(doc.infobox().type(), 'football club', 'Raith-Rovers: football club infobox')
  t.equal(doc.infobox().get('fullname').text(), 'Raith Rovers Football Club', 'Raith-Rovers: full club name')
  t.match(doc.text(), /Kirkcaldy/, 'Raith-Rovers: club home town')
  t.ok(
    doc.images().some((image) => /Raith/.test(image.file())),
    'Raith-Rovers: club crest'
  )
  t.equal(doc.isRedirect(), false, 'Raith-Rovers: not-redirect')
  t.equal(doc.infobox(0).data.clubname.text(), 'Raith Rovers', 'Raith-Rovers: clubname')
  t.equal(doc.categories().length, 10, 'Raith-Rovers: cat-length')
  t.equal(doc.images().length, 2, 'Raith-Rovers: img-length')
  t.equal(doc.image(1).file(), "File:Stark's_Park_-_geograph.org.uk_-_204446.jpg", 'Raith-Rovers: img-file')
  t.equal(
    doc.image(1).url(),
    `https://wikipedia.org/wiki/Special:Redirect/file/Stark's_Park_-_geograph.org.uk_-_204446.jpg`,
    'Raith-Rovers: image-url'
  )
  t.ok(doc.categories().includes('Raith Rovers F.C.'), 'Raith-Rovers: Raith Rovers F.C. category')
  t.ok(doc.categories().includes('Football clubs in Scotland'), 'Raith-Rovers: Football clubs in Scotland category')
  t.end()
})

test('Remote-Application-Programming-Interface', (t) => {
  const doc = wtf(readPage('Remote-Application-Programming-Interface'))
  t.equal(doc.title, 'Remote Application Programming Interface', 'Remote-Application-Programming-Interface: API name')
  t.ok(
    doc.links().some((link) => link.page() === 'Pocket PC'),
    'Remote-Application-Programming-Interface: server platform link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Remote Procedure Call'),
    'Remote-Application-Programming-Interface: RPC link'
  )
  t.match(doc.text(), /server/, 'Remote-Application-Programming-Interface: Pocket PC server role')
  t.match(doc.text(), /client/, 'Remote-Application-Programming-Interface: PC client role')
  t.ok(
    doc.categories().includes('Microsoft application programming interfaces'),
    'Remote-Application-Programming-Interface: Microsoft application programming interfaces category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Windows Registry'),
    'Remote-Application-Programming-Interface: Windows Registry link'
  )
  t.end()
})

test('Remote-Data-Objects', (t) => {
  const doc = wtf(readPage('Remote-Data-Objects'))
  t.equal(doc.title, 'Remote Data Objects', 'Remote-Data-Objects: technology name')
  t.ok(
    doc.links().some((link) => link.page() === 'Visual Basic'),
    'Remote-Data-Objects: programming language link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Windows 95'),
    'Remote-Data-Objects: supported operating system link'
  )
  t.match(doc.text(), /obsolete/, 'Remote-Data-Objects: technology status')
  t.ok(
    doc.links().some((link) => link.page() === 'data access'),
    'Remote-Data-Objects: data access link'
  )
  t.ok(
    doc.categories().includes('Microsoft application programming interfaces'),
    'Remote-Data-Objects: Microsoft application programming interfaces category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'application programming interface'),
    'Remote-Data-Objects: application programming interface link'
  )
  t.end()
})

test('Remote-Data-Services', (t) => {
  const doc = wtf(readPage('Remote-Data-Services'))
  t.equal(doc.title, 'Remote Data Services', 'Remote-Data-Services: technology name')
  t.ok(
    doc.links().some((link) => link.page() === 'ActiveX Data Objects'),
    'Remote-Data-Services: related technology link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Transact-SQL'),
    'Remote-Data-Services: SQL extension link'
  )
  t.match(doc.text(), /SOAP Toolkit 2\.0/, 'Remote-Data-Services: replacement technology')
  t.ok(
    doc.lists().some((list) => list.lines().some((line) => /MSDN/.test(line.text()))),
    'Remote-Data-Services: MSDN resource list'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Microsoft'),
    'Remote-Data-Services: Microsoft link'
  )
  t.ok(
    doc.categories().includes('Microsoft application programming interfaces'),
    'Remote-Data-Services: Microsoft application programming interfaces category'
  )
  t.end()
})

test('Routing-And-Remote-Access-Service', (t) => {
  const doc = wtf(readPage('Routing-And-Remote-Access-Service'))
  t.equal(doc.title, 'Routing and Remote Access Service', 'Routing-And-Remote-Access-Service: service name')
  t.ok(
    doc.links().some((link) => link.page() === 'Router (computing)'),
    'Routing-And-Remote-Access-Service: router link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Server (computing)'),
    'Routing-And-Remote-Access-Service: server link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'API'),
    'Routing-And-Remote-Access-Service: API link'
  )
  t.match(doc.text(), /Microsoft/, 'Routing-And-Remote-Access-Service: vendor')
  t.ok(
    doc.section('Routing and Remote Access Service Management Pack'),
    'Routing-And-Remote-Access-Service: Routing and Remote Access Service Management Pack section'
  )
  t.ok(
    doc.categories().includes('Microsoft application programming interfaces'),
    'Routing-And-Remote-Access-Service: Microsoft application programming interfaces category'
  )
  t.end()
})

test('Royal-Cinema', (t) => {
  const doc = wtf(readPage('Royal-Cinema'))
  t.equal(doc.infobox().get('name').text(), 'Royal Cinema', 'Royal-Cinema: venue name')
  t.equal(
    doc.infobox().get('former names').text(),
    'The Pylon, The Golden Princess',
    'Royal-Cinema: former venue names'
  )
  t.equal(doc.infobox().type(), 'venue', 'Royal-Cinema: venue infobox')
  t.match(doc.image().file(), /Royal_Cinema\.JPG$/, 'Royal-Cinema: cinema photograph')
  t.equal(doc.infobox().get('caption').text(), 'The Royal Cinema in 2009', 'Royal-Cinema: photo caption')
  t.equal(doc.infobox().template(), 'venue', 'Royal-Cinema: venue template')
  t.equal(doc.section().sentences().length, 10, 'Royal-Cinema: sentence-length')
  t.equal(doc.categories().length, 4, 'Royal-Cinema: cat-length')

  t.equal(doc.infobox().get('opened').text(), '1939', 'Royal-Cinema: year-string')
  // t.equal(doc.infobox().keyValue()['opened'], 1939, 'year-number');
  t.ok(
    doc.categories().includes('National Historic Sites in Ontario'),
    'Royal-Cinema: National Historic Sites in Ontario category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Art Moderne'),
    'Royal-Cinema: Art Moderne link'
  )
  t.end()
})

test('Runtime-Callable-Wrapper', (t) => {
  const doc = wtf(readPage('Runtime-Callable-Wrapper'))
  t.equal(doc.title, 'Runtime Callable Wrapper', 'Runtime-Callable-Wrapper: wrapper name')
  t.ok(
    doc.links().some((link) => link.page() === 'Component Object Model'),
    'Runtime-Callable-Wrapper: COM link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Common Language Runtime'),
    'Runtime-Callable-Wrapper: runtime link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'proxy pattern'),
    'Runtime-Callable-Wrapper: design pattern link'
  )
  t.match(doc.text(), /\.NET/, 'Runtime-Callable-Wrapper: software platform')
  t.ok(
    doc.categories().includes('Component-based software engineering'),
    'Runtime-Callable-Wrapper: Component-based software engineering category'
  )
  t.ok(
    doc.links().some((link) => link.page() === '.NET Framework'),
    'Runtime-Callable-Wrapper: .NET Framework link'
  )
  t.end()
})

test('Senate-Of-Pakistan', (t) => {
  const doc = wtf(readPage('Senate-Of-Pakistan'))
  t.equal(doc.infobox().type(), 'legislature', 'Senate-Of-Pakistan: legislature infobox')
  t.equal(
    doc.infobox().get('name').text(),
    'Senate of Pakistan ایوانِ بالا پاکستان',
    'Senate-Of-Pakistan: English and Urdu legislature name'
  )
  t.match(doc.text(), /upper legislative chamber/i, 'Senate-Of-Pakistan: legislative role')
  t.ok(
    doc.links().some((link) => link.page() === 'Pakistan'),
    'Senate-Of-Pakistan: country link'
  )
  t.ok(doc.tables().length > 0, 'Senate-Of-Pakistan: parliamentary data tables')
  t.ok(
    doc.links().some((link) => link.page() === 'upper house'),
    'Senate-Of-Pakistan: upper house link'
  )
  t.ok(doc.section('History'), 'Senate-Of-Pakistan: History section')
  t.end()
})

test('Terrence-Murphy-American-Football', (t) => {
  const doc = wtf(readPage('Terrence-Murphy-American-Football'))
  t.equal(doc.infobox().get('name').text(), 'Terrence Murphy', 'Terrence-Murphy-American-Football: player name')
  t.equal(doc.infobox().get('position').text(), 'Wide receiver', 'Terrence-Murphy-American-Football: football position')
  t.equal(doc.infobox().type(), 'nfl player', 'Terrence-Murphy-American-Football: NFL player infobox')
  t.match(doc.infobox().get('birth_place').text(), /Tyler, Texas/, 'Terrence-Murphy-American-Football: birthplace')
  t.ok(doc.references().length > 0, 'Terrence-Murphy-American-Football: career references')
  t.ok(doc.section('Playing career'), 'Terrence-Murphy-American-Football: Playing career section')
  t.ok(
    doc.infoboxes().some((box) => box.get('number').text() === '85'),
    'Terrence-Murphy-American-Football: number field'
  )
  t.end()
})

test('Teymanak-E-Olya', (t) => {
  const doc = wtf(readPage('Teymanak-E-Olya'))
  t.equal(doc.infobox().get('official_name').text(), 'Teymanak-e Olya', 'Teymanak-E-Olya: village name')
  t.equal(doc.infobox().get('native_name').text(), 'تيمنك عليا', 'Teymanak-E-Olya: Persian village name')
  t.equal(doc.infobox().get('settlement_type').text(), 'village', 'Teymanak-E-Olya: settlement type')
  t.equal(doc.infobox().get('pushpin_map').text(), 'Iran', 'Teymanak-E-Olya: map country')
  t.equal(doc.infobox().type(), 'settlement', 'Teymanak-E-Olya: settlement infobox')
  t.ok(
    doc.infoboxes().some((box) => box.get('population_as_of').text() === '2006'),
    'Teymanak-E-Olya: population_as_of field'
  )
  t.ok(
    doc.categories().includes('Populated places in Torbat-e Jam County'),
    'Teymanak-E-Olya: Populated places in Torbat-e Jam County category'
  )
  t.end()
})

test('The-Atlas-Newspaper', (t) => {
  const doc = wtf(readPage('The-Atlas-Newspaper'))
  t.equal(doc.title, 'The Atlas', 'The-Atlas-Newspaper: newspaper title')
  t.ok(
    doc.links().some((link) => link.page() === 'Robert Stephen Rintoul'),
    'The-Atlas-Newspaper: founder link'
  )
  t.ok(doc.section('History'), 'The-Atlas-Newspaper: newspaper history section')
  t.match(doc.text(), /1826/, 'The-Atlas-Newspaper: founding year')
  t.ok(
    doc.links().some((link) => link.page() === 'London'),
    'The-Atlas-Newspaper: founding city link'
  )
  t.ok(doc.categories().includes('London newspapers'), 'The-Atlas-Newspaper: London newspapers category')
  t.ok(
    doc.links().some((link) => link.page() === 'England'),
    'The-Atlas-Newspaper: England link'
  )
  t.end()
})

test('The-Field-Of-Waterloo', (t) => {
  const doc = wtf(readPage('The-Field-Of-Waterloo'))
  t.equal(doc.title, 'The Field of Waterloo', 'The-Field-Of-Waterloo: poem title')
  t.ok(
    doc.links().some((link) => link.page() === 'Sir Walter Scott'),
    'The-Field-Of-Waterloo: poet link'
  )
  t.match(doc.text(), /1815/, 'The-Field-Of-Waterloo: publication year')
  t.ok(doc.references().length > 0, 'The-Field-Of-Waterloo: bibliographic references')
  t.ok(
    doc.categories().some((category) => /poem/i.test(category)),
    'The-Field-Of-Waterloo: poetry category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'James Ballantyne'),
    'The-Field-Of-Waterloo: James Ballantyne link'
  )
  t.ok(doc.categories().includes('Poetry by Walter Scott'), 'The-Field-Of-Waterloo: Poetry by Walter Scott category')
  t.end()
})

test('Toronto', (t) => {
  const doc = wtf(readPage('Toronto'))
  t.deepEqual(doc.coordinate(), { template: 'infobox/lat-long', lat: 43.7, lon: -79.4 }, 'Toronto: city coordinates')
  t.equal(doc.title, 'Toronto', 'Toronto: city title')
  t.ok(
    doc.links().some((link) => link.page() === 'Ontario'),
    'Toronto: province link'
  )
  t.ok(doc.section('History'), 'Toronto: city history section')
  t.ok(
    doc.links().some((link) => link.page() === 'Lake Ontario'),
    'Toronto: waterfront location'
  )
  t.ok(doc.infoboxes().length > 0, 'Toronto: municipal infobox')
  t.ok(doc.section('Before 1800'), 'Toronto: Before 1800 section')
  t.ok(
    doc.infoboxes().some((box) => box.get('official_name').text() === 'City of Toronto'),
    'Toronto: official_name field'
  )
  t.end()
})

test('Toronto-Star', (t) => {
  const doc = wtf(readPage('Toronto-Star'))
  t.equal(doc.infobox().type(), 'newspaper', 'Toronto-Star: newspaper infobox')
  t.equal(doc.infobox().get('publisher').text(), 'John D. Cruickshank', 'Toronto-Star: publisher in this snapshot')
  t.ok(doc.section('History'), 'Toronto-Star: newspaper history section')
  t.match(doc.image().file(), /Toronto[ _]Star[ _]frontpage/, 'Toronto-Star: front-page image')
  t.ok(doc.references().length > 0, 'Toronto-Star: newspaper references')
  t.equal(doc.infobox().data.publisher.text(), 'John D. Cruickshank', 'Toronto-Star: publisher.text')
  t.equal(doc.infobox().template(), 'newspaper', 'Toronto-Star: newspaper template')
  const section = doc.section('history')
  t.equal(section.sentences().length, 21, 'Toronto-Star: sentence-length')
  t.equal(doc.categories().length, 6, 'Toronto-Star: sentence-length')
  // t.equal(doc.text['Notable cartoonists'], undefined, t);
  t.ok(
    doc.infoboxes().some((box) => box.get('managing editor').text() === 'Jane Davenport'),
    'Toronto-Star: managing editor field'
  )
  t.ok(
    doc.categories().includes('Publications established in 1892'),
    'Toronto-Star: Publications established in 1892 category'
  )
  t.end()
})

test('Toronto-Star-Cartoonists', (t) => {
  const doc = wtf(readPage('Toronto-Star'))
  t.equal(doc.isRedirect(), false, 'Toronto-Star: not-redirect')
  t.equal(doc.isDisambig(), false, 'Toronto-Star: not-disambig')
  t.equal(doc.infobox().data.publisher.text(), 'John D. Cruickshank', 'Toronto-Star: publisher.text')
  t.equal(doc.infobox().template(), 'newspaper', 'Toronto-Star: newspaper template')
  let section = doc.section('history')
  t.equal(section.sentences().length, 21, 'Toronto-Star: history-length')
  t.equal(doc.categories().length, 6, 'Toronto-Star: cat-length')
  section = doc.section('Notable cartoonists')
  t.equal(section.list().json().length, 10, 'Toronto-Star: cartoonist-length')
  t.end()
})

test('Tour-EP-Band-Of-Horses-EP', (t) => {
  const doc = wtf(readPage('Tour-EP-Band-Of-Horses-EP'))
  t.equal(doc.infobox().get('name').text(), 'Tour EP', 'Tour-EP-Band-Of-Horses-EP: release title')
  t.equal(doc.infobox().get('artist').text(), 'Band of Horses', 'Tour-EP-Band-Of-Horses-EP: performing artist')
  t.equal(doc.infobox().get('Type').text(), 'EP', 'Tour-EP-Band-Of-Horses-EP: release format')
  t.equal(doc.infobox().get('Released').text(), '2005', 'Tour-EP-Band-Of-Horses-EP: release year')
  t.equal(doc.infobox().type(), 'album', 'Tour-EP-Band-Of-Horses-EP: album infobox')
  t.ok(doc.categories().includes('Band of Horses albums'), 'Tour-EP-Band-Of-Horses-EP: Band of Horses albums category')
  t.ok(
    doc.links().some((link) => link.page() === 'Everything All the Time'),
    'Tour-EP-Band-Of-Horses-EP: Everything All the Time link'
  )
  t.end()
})

test('United-Kingdom', (t) => {
  const doc = wtf(readPage('United-Kingdom'))
  t.match(doc.title, /United Kingdom/, 'United-Kingdom: country title')
  t.ok(
    doc.links().some((link) => link.page() === 'London'),
    'United-Kingdom: capital city link'
  )
  t.ok(doc.section('History'), 'United-Kingdom: national history section')
  t.ok(
    doc.links().some((link) => link.page() === 'Great Britain'),
    'United-Kingdom: largest island link'
  )
  t.ok(doc.references().length > 0, 'United-Kingdom: country references')
  t.ok(
    doc.links().some((link) => link.page() === 'sovereign state'),
    'United-Kingdom: sovereign state link'
  )
  t.ok(doc.section('Etymology and terminology'), 'United-Kingdom: Etymology and terminology section')
  t.end()
})

test('University-Of-Nevada-Reno-Arboretum', (t) => {
  const doc = wtf(readPage('University-Of-Nevada-Reno-Arboretum'))
  t.equal(doc.title, 'University of Nevada, Reno Arboretum', 'University-Of-Nevada-Reno-Arboretum: arboretum name')
  t.ok(doc.coordinates().length > 0, 'University-Of-Nevada-Reno-Arboretum: arboretum location')
  t.ok(
    doc.links().some((link) => link.page() === 'arboretum'),
    'University-Of-Nevada-Reno-Arboretum: arboretum classification link'
  )
  t.equal(doc.coordinate().lat, 39.54583, 'University-Of-Nevada-Reno-Arboretum: latitude')
  t.equal(doc.coordinate().lon, -119.81667, 'University-Of-Nevada-Reno-Arboretum: longitude')
  t.ok(
    doc.categories().includes('1985 establishments in Nevada'),
    'University-Of-Nevada-Reno-Arboretum: 1985 establishments in Nevada category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Reno, Nevada'),
    'University-Of-Nevada-Reno-Arboretum: Reno, Nevada link'
  )
  t.end()
})

test('Willow', (t) => {
  const doc = wtf(readPage('Willow'))
  t.match(doc.text(), /Salix/, 'Willow: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salix alba'),
    'Willow: botanical link'
  )
  t.ok(doc.section('Description'), 'Willow: botanical section')
  t.ok(doc.images().length > 0, 'Willow: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow: botanical categories')
  t.match(doc.text(), /deciduous/, 'Willow: deciduous growth habit')
  t.ok(doc.categories().includes('Dioecious plants'), 'Willow: Dioecious plants category')
  t.end()
})

test('Wimbledon-Championships', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'All England Lawn Tennis and Croquet Club'),
    'Wimbledon-Championships: tennis or venue link'
  )
  t.ok(doc.section('History'), 'Wimbledon-Championships: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships: tournament sources')
  t.ok(
    doc.categories().includes('Wimbledon Championships'),
    'Wimbledon-Championships: Wimbledon Championships category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Wimbledon, London'),
    'Wimbledon-Championships: Wimbledon, London link'
  )
  t.end()
})
