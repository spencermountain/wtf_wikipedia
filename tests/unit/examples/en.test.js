import withoutWiki from '../../lib/withoutWiki.js'
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
  t.equal(
    doc.sentences()[0].links()[0].text(),
    '2008 MotoGP championship',
    "2008-British-Motorcycle-Grand-Prix: 1st sentence shows '2008 MotoGP championship' for 2008 Grand Prix motorcycle racing season"
  )
  t.equal(
    doc.sentences()[1].text(),
    'It took place on the weekend of 20–22 June 2008 at the Donington Park circuit.',
    '2008-British-Motorcycle-Grand-Prix: 2nd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'MotoGP classification', '2008-British-Motorcycle-Grand-Prix: section [1] title')
  t.equal(
    doc.tables()[2].rows()[10]['time/retired'],
    '+18.976',
    "2008-British-Motorcycle-Grand-Prix: table 3, row 11, 'time/retired' column"
  )
  t.equal(
    doc.references()[0].title(),
    'MotoGP official website',
    '2008-British-Motorcycle-Grand-Prix: 1st reference title'
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    '2008 British motorcycle Grand Prix',
    "2008-British-Motorcycle-Grand-Prix: 1st sentence bolds '2008 British motorcycle Grand Prix'"
  )
  t.equal(doc.images()[0].file(), 'File:Donington_as_of_2006.svg', '2008-British-Motorcycle-Grand-Prix: 1st image file')
  t.equal(doc.categories()[1], '2008 MotoGP race reports', '2008-British-Motorcycle-Grand-Prix: 2nd category')
  t.equal(doc.sections().length, 5, '2008-British-Motorcycle-Grand-Prix: 5 sections')
  t.equal(doc.links()[25].page(), 'Dani Pedrosa', "2008-British-Motorcycle-Grand-Prix: link [25] is 'Dani Pedrosa'")
  t.ok(
    doc.templates('MotoGP_race_report').length > 0,
    '2008-British-Motorcycle-Grand-Prix: has a {{MotoGP_race_report}} template'
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
  t.ok(doc.section('winners'), 'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: Winners section')
  t.equal(
    doc.sentences()[3].text(),
    '{{legend|#FAEB86|Winner of competitive award|border=1px #555 solid}} {{legend|#91CFF6|Winner of special award|border=1px #555 solid}}',
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: 4th sentence text (unparsed legend templates, joined)'
  )
  t.equal(
    doc.sections()[2].title(),
    'See also',
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: section [2] title'
  )
  t.equal(
    doc.infobox().get('website').text(),
    'http://www.aacta.org',
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: infobox website'
  )
  t.equal(
    doc.tables()[0].rows()[4]['craft'],
    'Cinematography',
    "AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: table 1, row 5, 'craft' column"
  )
  t.equal(
    doc.references()[3].title(),
    'AACTA - Past Winners - 2000-2010 - 2008',
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: 4th reference title'
  )
  t.ok(
    doc.sentences()[0].text().startsWith('The AACTA Award for Outstanding Achievement in'),
    "AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: 1st sentence starts 'The AACTA Award for Outstandin…'"
  )
  t.equal(
    doc.lists()[2].lines()[0].text(),
    'The Australian Academy of Cinema and Television Arts Official website',
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: list 3, item 1'
  )
  t.equal(
    doc.categories()[0],
    'Awards established in 2006',
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: 1st category'
  )
  t.equal(doc.sections().length, 5, 'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: 5 sections')
  t.equal(
    doc.links()[17].page(),
    '2008 Australian Film Institute Awards',
    "AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: link [17] is '2008 Australian Film Institute Awards'"
  )
  t.ok(
    doc.templates('dead link').length > 0,
    'AACTA-Award-For-Outstanding-Achievement-In-Short-Film-Screen-Craft: has a {{dead link}} template'
  )
  t.end()
})

test('Al-Haytham', (t) => {
  const doc = wtf(readPage('Al-Haytham'))
  t.equal(doc.infobox().type(), 'scientist', 'Al-Haytham: scientist infobox')
  t.match(doc.text(), /optics/i, 'Al-Haytham: scientific work appears in the article')
  t.match(doc.infobox().get('name').text(), /Hasan Ibn al-Haytham/, 'Al-Haytham: scientist name')
  t.ok(doc.references().length > 0, 'Al-Haytham: scientific biography sources')
  t.match(doc.text(), /Book of Optics/, 'Al-Haytham: principal work')
  t.ok(doc.section('biography'), 'Al-Haytham: Biography section')
  t.ok(
    doc.links().some((link) => link.page() === 'Basra'),
    'Al-Haytham: birth city link'
  )
  t.equal(
    doc.section('Number theory').sentences()[0].links()[1].page(),
    'Perfect number',
    "Al-Haytham: 'Number theory' section, 1st sentence links to 'Perfect number'"
  )
  t.equal(
    doc.section('Mathematical works').sentences()[0].links()[0].text(),
    'mathematics',
    "Al-Haytham: 'Mathematical works' section, 1st sentence shows 'mathematics' for Islamic mathematics"
  )
  t.equal(
    doc.sentences()[18].text(),
    'Optics was translated into Latin by an unknown scholar at the end of the 12th century or the beginning of the 13th century.',
    'Al-Haytham: 19th sentence text'
  )
  t.equal(doc.sections()[22].title(), 'Engineering', 'Al-Haytham: section [22] title')
  t.equal(doc.infobox().get('death_place').text(), 'Cairo, Egypt', 'Al-Haytham: infobox death_place')
  t.equal(
    doc.section('Legacy').sentences()[6].links()[1].page(),
    'Parabola',
    "Al-Haytham: 'Legacy' section, 7th sentence links to 'Parabola'"
  )
  t.equal(
    doc.references()[16].title(),
    'Al-Haytham the man of experience. First steps in the science of vision',
    'Al-Haytham: 17th reference title'
  )
  t.ok(
    doc
      .section('Doubts Concerning Ptolemy')
      .sentences()[0]
      .text()
      .startsWith('In his Al-Shukūk ‛alā Batlamyūs, variously translated'),
    "Al-Haytham: 'Doubts Concerning Ptolemy' section, 1st sentence starts 'In his Al-Shukūk ‛alā Batlamyū…'"
  )
  t.equal(doc.lists()[2].lines()[8].text(), 'Physics in medieval Islam', 'Al-Haytham: list 3, item 9')
  t.equal(
    doc.section('Commemorations').sentences()[6].bolds()[0].text,
    '1001 Inventions and the World of Ibn Al-Haytham',
    "Al-Haytham: 'Commemorations' section, 7th sentence bolds '1001 Inventions and the World of Ibn Al-Haytham'"
  )
  t.equal(doc.images()[0].file(), 'File:Thesaurus_opticus_Titelblatt.jpg', 'Al-Haytham: 1st image file')
  t.end()
})

test('Alanine-Oxo-Acid-Transaminase', (t) => {
  const doc = wtf(readPage('Alanine-Oxo-Acid-Transaminase'))
  t.equal(doc.title, 'alanine-oxo-acid transaminase', 'Alanine-Oxo-Acid-Transaminase: enzyme title')
  t.ok(
    doc.links().some((link) => link.page() === 'Enzymology'),
    'Alanine-Oxo-Acid-Transaminase: enzymology link'
  )
  t.match(doc.text(), /enzyme/i, 'Alanine-Oxo-Acid-Transaminase: biochemical role')
  t.ok(
    doc.categories().some((category) => /EC 2\.6\.1/.test(category)),
    'Alanine-Oxo-Acid-Transaminase: enzyme classification category'
  )
  t.ok(doc.references().length > 0, 'Alanine-Oxo-Acid-Transaminase: research references')
  t.ok(
    doc.links().some((link) => link.page() === 'Pyridoxal phosphate'),
    'Alanine-Oxo-Acid-Transaminase: enzyme cofactor link'
  )
  t.ok(doc.categories().includes('EC 2.6.1'), 'Alanine-Oxo-Acid-Transaminase: EC 2.6.1 category')
  t.equal(
    doc.sentences()[6].links()[0].page(),
    'Cofactor (biochemistry)',
    "Alanine-Oxo-Acid-Transaminase: 7th sentence links to 'Cofactor (biochemistry)'"
  )
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'catalyzes',
    "Alanine-Oxo-Acid-Transaminase: 1st sentence shows 'catalyzes' for Catalysis"
  )
  t.equal(
    doc.sentences()[1].text(),
    'Thus, the two substrates of this enzyme are L-alanine and 2-oxo acid, whereas its two products are pyruvate and L-amino acid.',
    'Alanine-Oxo-Acid-Transaminase: 2nd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'References', 'Alanine-Oxo-Acid-Transaminase: section [1] title')
  t.equal(
    doc.sentences()[2].links()[1].page(),
    'Transaminases',
    "Alanine-Oxo-Acid-Transaminase: 3rd sentence links to 'Transaminases'"
  )
  t.equal(
    doc.references()[1].title(),
    'Transaminations with pyruvate and other alpha-keto acids',
    'Alanine-Oxo-Acid-Transaminase: 2nd reference title'
  )
  t.ok(
    doc.sentences()[4].text().startsWith('Other names in common use include L-alanine-alpha-keto'),
    "Alanine-Oxo-Acid-Transaminase: 5th sentence starts 'Other names in common use incl…'"
  )
  t.equal(
    doc.sentences()[4].bolds()[0].text,
    'L-alanine-alpha-keto acid aminotransferase',
    "Alanine-Oxo-Acid-Transaminase: 5th sentence bolds 'L-alanine-alpha-keto acid aminotransferase'"
  )
  t.equal(doc.categories()[1], 'Pyridoxal phosphate enzymes', 'Alanine-Oxo-Acid-Transaminase: 2nd category')
  t.equal(doc.sections().length, 2, 'Alanine-Oxo-Acid-Transaminase: 2 sections')
  t.equal(
    doc.sentences()[2].links()[0].page(),
    'Transferase',
    "Alanine-Oxo-Acid-Transaminase: 3rd sentence links to 'Transferase'"
  )
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
  t.match(doc.images()[0].file(), /LeylandLeopardAlexanderYType/, 'Alexander-Y-Type: vehicle photograph')
  t.match(doc.text(), /Walter Alexander/, 'Alexander-Y-Type: body manufacturer')
  t.ok(doc.categories().includes('Alexander Dennis buses'), 'Alexander-Y-Type: Alexander Dennis buses category')
  t.ok(
    doc.links().some((link) => link.page() === 'Single-decker bus'),
    'Alexander-Y-Type: single-decker bus link'
  )
  t.equal(doc.sentences()[2].links()[1].page(), 'Belfast', "Alexander-Y-Type: 3rd sentence links to 'Belfast'")
  t.equal(
    doc.section('Other customers').sentences()[1].links()[1].text(),
    'Potteries Motor Traction',
    "Alexander-Y-Type: 'Other customers' section, 2nd sentence shows 'Potteries Motor Traction' for First Potteries"
  )
  t.equal(
    doc.sentences()[1].text(),
    'It was built on a wide range of chassis between 1962 and 1983.',
    'Alexander-Y-Type: 2nd sentence text'
  )
  t.equal(doc.sections()[3].title(), 'External links', 'Alexander-Y-Type: section [3] title')
  t.equal(doc.infobox().get('production').text(), '1962–1983', 'Alexander-Y-Type: infobox production')
  t.equal(
    doc.section('Other customers').sentences()[1].links()[1].page(),
    'First Potteries',
    "Alexander-Y-Type: 'Other customers' section, 2nd sentence links to 'First Potteries'"
  )
  t.equal(doc.tables()[0].rows()[7]['notes'], 'LH6P model', "Alexander-Y-Type: table 1, row 8, 'notes' column")
  t.ok(
    doc
      .section('Other customers')
      .sentences()[1]
      .text()
      .startsWith('However other customers also existed, amongst these'),
    "Alexander-Y-Type: 'Other customers' section, 2nd sentence starts 'However other customers also e…'"
  )
  t.equal(
    doc.lists()[0].lines()[0].text(),
    'Preserved Ex Clydeside Scottish Leyland Leopard Bus Website',
    'Alexander-Y-Type: list 1, item 1'
  )
  t.equal(doc.sentences()[3].bolds()[0].text, 'AY Type', "Alexander-Y-Type: 4th sentence bolds 'AY Type'")
  t.equal(doc.images()[0].file(), 'File:LeylandLeopardAlexanderYTypeMFR306P.jpg', 'Alexander-Y-Type: 1st image file')
  t.end()
})

test('Allen-R-Morris', (t) => {
  const doc = wtf(readPage('Allen-R-Morris'))
  t.equal(doc.infobox().get('birth_name').text(), 'Allen Robert Morris', 'Allen-R-Morris: birth name')
  t.match(doc.images()[0].file(), /AllenMorrisHeadShot\.jpg$/, 'Allen-R-Morris: portrait filename')
  t.equal(doc.infobox().type(), 'person', 'Allen-R-Morris: biography infobox')
  t.match(doc.text(), /Emmy/, 'Allen-R-Morris: television awards')
  t.ok(doc.citations().length > 0, 'Allen-R-Morris: career sources')
  t.ok(
    doc.links().some((link) => link.page() === 'Lufkin, Texas'),
    'Allen-R-Morris: Lufkin, Texas link'
  )
  t.ok(doc.section('early life'), 'Allen-R-Morris: Early life section')
  t.equal(
    doc.section('Boards Served').sentences()[0].links()[0].page(),
    'Lone Star Emmy Awards',
    "Allen-R-Morris: 'Boards Served' section, 1st sentence links to 'Lone Star Emmy Awards'"
  )
  t.equal(
    doc.sentences()[33].links()[1].text(),
    'KDOG-TV',
    "Allen-R-Morris: 34th sentence shows 'KDOG-TV' for KRIV (TV)"
  )
  t.equal(
    doc.section('College').sentences()[0].text(),
    'The original plan was to attend Baylor University on a music scholarship.',
    "Allen-R-Morris: 'College' section, 1st sentence text"
  )
  t.equal(doc.sections()[2].title(), 'College', 'Allen-R-Morris: section [2] title')
  t.equal(doc.infobox().get('birth_place').text(), 'Dallas, Texas, U.S.', 'Allen-R-Morris: infobox birth_place')
  t.equal(doc.sentences()[13].links()[0].page(), 'Howdy Doody', "Allen-R-Morris: 14th sentence links to 'Howdy Doody'")
  t.equal(doc.tables()[0].rows()[3]['year'], '1977–79', "Allen-R-Morris: table 1, row 4, 'year' column")
  t.ok(
    doc.section('Boards Served').sentences()[1].text().startsWith('He is also serving as the Co-Chair'),
    "Allen-R-Morris: 'Boards Served' section, 2nd sentence starts 'He is also serving as the Co-C…'"
  )
  t.equal(
    doc.lists()[1].lines()[0].text(),
    '"I saw my parents argue once. It lasted about fifteen seconds; the most terrifying fifteen seconds of my life."',
    'Allen-R-Morris: list 2, item 1'
  )
  t.equal(
    doc.section('Back to the Majors').sentences()[0].bolds()[0].text,
    'Richard Kidd Productions',
    "Allen-R-Morris: 'Back to the Majors' section, 1st sentence bolds 'Richard Kidd Productions'"
  )
  t.equal(
    doc.images()[2].file(),
    "File:Charlie_Cudd_and_Allen_Morris_in_THEY'D_HANG_YOU_IN_NASHVILLE_001.jpg",
    'Allen-R-Morris: 3rd image file'
  )
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
  t.ok(doc.section('brands portfolio'), 'Alsea-Company: Brands portfolio section')
  t.ok(
    doc.infoboxes().some((box) => box.get('name').text() === 'Alsea, S.A.B. de C.V.'),
    'Alsea-Company: name field'
  )
  t.equal(doc.sentences()[5].links()[0].page(), 'Mexico', "Alsea-Company: 6th sentence links to 'Mexico'")
  t.equal(
    doc.sentences()[6].links()[1].text(),
    'IPC',
    "Alsea-Company: 7th sentence shows 'IPC' for Indice de Precios y Cotizaciones"
  )
  t.equal(
    doc.sentences()[6].text(),
    'Alsea is listed on the Mexican Stock Exchange and is a constituent of the IPC, the main benchmark index of Mexican stocks.',
    'Alsea-Company: 7th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'Recent news', 'Alsea-Company: section [2] title')
  t.equal(doc.infobox().get('predecessor').text(), 'Operadora DP, S.A. de C.V', 'Alsea-Company: infobox predecessor')
  t.equal(doc.sentences()[3].links()[0].page(), 'Starbucks', "Alsea-Company: 4th sentence links to 'Starbucks'")
  t.equal(doc.tables()[0].rows()[0]['type'], 'Fast Food', "Alsea-Company: table 1, row 1, 'type' column")
  t.equal(doc.references()[0].title(), 'Top 10 del Ranking 2014', 'Alsea-Company: 1st reference title')
  t.ok(
    doc.sentences()[3].text().startsWith('Some of the restaurant chains that Alsea'),
    "Alsea-Company: 4th sentence starts 'Some of the restaurant chains…'"
  )
  t.equal(doc.images()[0].file(), 'File:Alsea_logo.png', 'Alsea-Company: 1st image file')
  t.equal(doc.categories()[4], '1989 establishments in Mexico', 'Alsea-Company: 5th category')
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
  t.equal(
    doc.section('Professional career').sentences()[6].links()[0].page(),
    'Cleveland Crunch',
    "Altimont-Butler: 'Professional career' section, 7th sentence links to 'Cleveland Crunch'"
  )
  t.equal(
    doc.section('Youth career').sentences()[4].links()[1].text(),
    "L'Etoile",
    "Altimont-Butler: 'Youth career' section, 5th sentence shows 'L'Etoile' for L'Etoile de Morne-à-l'Eau"
  )
  t.equal(
    doc.sentences()[1].text(),
    "Butler's youth career began at age 12 with the Golden Star in Port Royal.",
    'Altimont-Butler: 2nd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'Youth career', 'Altimont-Butler: section [1] title')
  t.equal(doc.infobox().get('years10').text(), '1998', 'Altimont-Butler: infobox years10')
  t.equal(
    doc.sentences()[0].links()[1].page(),
    'Football (soccer)',
    "Altimont-Butler: 1st sentence links to 'Football (soccer)'"
  )
  t.ok(
    doc.sentences()[13].text().startsWith('In February 1996, the San Jose Clash'),
    "Altimont-Butler: 14th sentence starts 'In February 1996, the San Jose…'"
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'Career synopsis with interview', 'Altimont-Butler: list 1, item 1')
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Altimont “Freddie” Butler',
    "Altimont-Butler: 1st sentence bolds 'Altimont “Freddie” Butler'"
  )
  t.equal(doc.categories()[2], 'Cleveland Crunch (NPSL) players', 'Altimont-Butler: 3rd category')
  t.equal(doc.sections().length, 7, 'Altimont-Butler: 7 sections')
  t.end()
})

test('Anarchism', (t) => {
  const doc = wtf(readPage('Anarchism'))
  t.equal(doc.title, 'Anarchism', 'Anarchism: article title')
  t.ok(doc.lists().length > 0, 'Anarchism: article includes lists')
  t.match(doc.sentences()[0].text(), /political philosophy/, 'Anarchism: opening definition')
  t.ok(doc.section('history'), 'Anarchism: history section')
  t.ok(doc.references().length > 0, 'Anarchism: historical sources')
  t.ok(doc.categories().includes('Political culture'), 'Anarchism: Political culture category')
  t.ok(
    doc.links().some((link) => link.page() === 'Stateless society'),
    'Anarchism: stateless society link'
  )
  t.equal(
    doc.section('Conflicts with European fascist regimes').sentences()[7].links()[2].page(),
    'Sonnenburg',
    "Anarchism: 'Conflicts with European fascist regimes' section, 8th sentence links to 'Sonnenburg'"
  )
  t.equal(
    doc.section('Spanish Revolution').sentences()[7].links()[1].text(),
    'dissident Marxists',
    "Anarchism: 'Spanish Revolution' section, 8th sentence shows 'dissident Marxists' for Workers' Party of Marxist Unification"
  )
  t.equal(
    doc.section('Collectivist anarchism').sentences()[7].text(),
    '2005. Marx in Context.',
    "Anarchism: 'Collectivist anarchism' section, 8th sentence text"
  )
  t.equal(doc.sections()[3].title(), 'Origins', 'Anarchism: section [3] title')
  t.equal(
    doc.section('Criticisms').sentences()[0].links()[0].page(),
    'Morality',
    "Anarchism: 'Criticisms' section, 1st sentence links to 'Morality'"
  )
  t.equal(
    doc.references()[14].title(),
    "Anarchism, the Creed That Won't Stay Dead; The Spread of World Capitalism Resurrects a Long-Dormant Movement",
    'Anarchism: 15th reference title'
  )
  t.ok(
    doc.sentences()[17].text().startsWith('But to claim that this central aspect'),
    "Anarchism: 18th sentence starts 'But to claim that this central…'"
  )
  t.equal(
    doc.lists()[3].lines()[4].text(),
    "Daily Bleed's Anarchist Encyclopedia&nbsp;–700+ entries, with short biographies, links and dedicated pages",
    'Anarchism: list 4, item 5'
  )
  t.equal(doc.images()[1].file(), 'File:WilliamGodwin.jpg', 'Anarchism: 2nd image file')
  t.equal(doc.categories()[6], 'Far-left politics', 'Anarchism: 7th category')
  t.equal(doc.section('Anarcho-syndicalism').depth(), 3, "Anarchism: 'Anarcho-syndicalism' is a depth-3 subsection")
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
  t.ok(doc.section('career'), 'Antique-Band: Career section')
  t.equal(doc.sentences()[14].links()[0].page(), 'Katy Garbi', "Antique-Band: 15th sentence links to 'Katy Garbi'")
  t.equal(
    doc.sentences()[16].links()[2].text(),
    'V-Power',
    "Antique-Band: 17th sentence shows 'V-Power' for Shell V-Power"
  )
  t.equal(
    doc.section('Awards').sentences()[1].text(),
    'Eurovision Song Contest',
    "Antique-Band: 'Awards' section, 2nd sentence text"
  )
  t.equal(doc.sections()[7].title(), 'References', 'Antique-Band: section [7] title')
  t.equal(
    doc.sentences()[16].links()[0].page(),
    'Royal Dutch Shell',
    "Antique-Band: 17th sentence links to 'Royal Dutch Shell'"
  )
  t.equal(doc.references()[0].title(), 'ΒΙΟΓΡΑΦΙΚΟ Ελενα Παπαρίζου', 'Antique-Band: 1st reference title')
  t.ok(
    doc.sentences()[6].text().startsWith('At that time, some record producers were'),
    "Antique-Band: 7th sentence starts 'At that time, some record prod…'"
  )
  t.equal(
    doc.lists()[4].lines()[1].text(),
    'Best Dance Song (2001, "(I Would) Die for You", nominated)',
    'Antique-Band: list 5, item 2'
  )
  t.equal(
    doc.section('Awards').sentences()[1].bolds()[0].text,
    'Eurovision Song Contest',
    "Antique-Band: 'Awards' section, 2nd sentence bolds 'Eurovision Song Contest'"
  )
  t.equal(doc.images()[0].file(), 'File:Paparizou_Ivi_Fruitea_1.jpg', 'Antique-Band: 1st image file')
  t.equal(doc.categories()[3], 'Eurovision Song Contest entrants of 2001', 'Antique-Band: 4th category')
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
  t.equal(doc.sentences()[8].links()[1].page(), 'Peshawar', "Anwar-Kamal-Khan: 9th sentence links to 'Peshawar'")
  t.equal(
    doc.sentences()[3].links()[0].text(),
    'Senator',
    "Anwar-Kamal-Khan: 4th sentence shows 'Senator' for Senate of Pakistan"
  )
  t.equal(
    doc.sentences()[3].text(),
    'Earlier he has also remained a Senator in addition to being a Senior Provincial Minister.',
    'Anwar-Kamal-Khan: 4th sentence text'
  )
  t.equal(doc.sections()[1].title(), 'References', 'Anwar-Kamal-Khan: section [1] title')
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'Khan Habibullah Khan',
    "Anwar-Kamal-Khan: 2nd sentence links to 'Khan Habibullah Khan'"
  )
  t.ok(
    doc.sentences()[7].text().startsWith('A former opponent of action against the'),
    "Anwar-Kamal-Khan: 8th sentence starts 'A former opponent of action ag…'"
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Anwar Kamal Khan Marwat Mina Khel',
    "Anwar-Kamal-Khan: 1st sentence bolds 'Anwar Kamal Khan Marwat Mina Khel'"
  )
  t.equal(doc.categories()[3], 'Pakistan Muslim League (N) politicians', 'Anwar-Kamal-Khan: 4th category')
  t.equal(doc.sections().length, 2, 'Anwar-Kamal-Khan: 2 sections')
  t.equal(
    doc.sentences()[8].links()[0].page(),
    'Lady Reading Hospital',
    "Anwar-Kamal-Khan: 9th sentence links to 'Lady Reading Hospital'"
  )
  t.equal(doc.links()[0].page(), 'The Economist', "Anwar-Kamal-Khan: link [0] is 'The Economist'")
  t.end()
})

test('Arts-Club-Of-Chicago', (t) => {
  const doc = wtf(readPage('Arts-Club-Of-Chicago'))
  t.equal(doc.images()[0].file(), 'File:20070701_Arts_Club_of_Chicago.JPG', 'Arts-Club-Of-Chicago: club image')
  t.ok(doc.tables().length > 0, 'Arts-Club-Of-Chicago: article tables survive parsing')
  t.equal(
    doc.templates('good article')[0].json().template,
    'Good article',
    'Arts-Club-Of-Chicago: article quality template'
  )
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
  t.equal(
    doc.section('Exhibitions, performances and lectures').sentences()[4].links()[1].page(),
    'Marc Chagall',
    "Arts-Club-Of-Chicago: 'Exhibitions, performances and lectures' section, 5th sentence links to 'Marc Chagall'"
  )
  t.equal(
    doc.sentences()[0].links()[0].text(),
    'Near North Side',
    "Arts-Club-Of-Chicago: 1st sentence shows 'Near North Side' for Near North Side, Chicago"
  )
  t.equal(
    doc.sentences()[21].text(),
    "It had office space in the Fine Arts Building that became too limiting to serve the club's mission.",
    'Arts-Club-Of-Chicago: 22nd sentence text'
  )
  t.equal(doc.sections()[5].title(), 'Highlights', 'Arts-Club-Of-Chicago: section [5] title')
  t.equal(
    doc.infobox().get('pushpin_map').text(),
    'United States Chicago Near North Side',
    'Arts-Club-Of-Chicago: infobox pushpin_map'
  )
  t.equal(
    doc.sentences()[26].links()[0].page(),
    'Wrigley Building',
    "Arts-Club-Of-Chicago: 27th sentence links to 'Wrigley Building'"
  )
  t.equal(
    doc.tables()[1].rows()[3]['name'],
    'Mrs. William B. Hale',
    "Arts-Club-Of-Chicago: table 2, row 4, 'name' column"
  )
  t.equal(doc.references()[17].title(), 'Chicago Architecture and Design', 'Arts-Club-Of-Chicago: 18th reference title')
  t.ok(
    doc.section('Membership').sentences()[0].text().startsWith('To become a member of the Arts'),
    "Arts-Club-Of-Chicago: 'Membership' section, 1st sentence starts 'To become a member of the Arts'"
  )
  t.equal(
    doc.lists()[2].lines()[0].text(),
    'The Arts Club of Chicago official website',
    'Arts-Club-Of-Chicago: list 3, item 1'
  )
  t.equal(
    doc.images()[1].file(),
    'File:20070711_Mies_van_der_Rohe_Staircase.JPG',
    'Arts-Club-Of-Chicago: 2nd image file'
  )
  t.end()
})

test('Bodmin', (t) => {
  const doc = wtf(readPage('Bodmin'))
  t.equal(doc.infobox().type(), 'uk place', 'Bodmin: UK place infobox')
  t.match(doc.text(), /Cornwall/, 'Bodmin: location in Cornwall')
  t.ok(doc.section('history'), 'Bodmin: town history section')
  t.match(doc.infobox().get('static_image_name').text(), /Bodmin Public Rooms/, 'Bodmin: town photograph field')
  t.ok(
    doc.categories().some((category) => /Cornwall/.test(category)),
    'Bodmin: Cornwall category'
  )
  t.ok(doc.categories().includes('Towns in Cornwall'), 'Bodmin: Towns in Cornwall category')
  t.ok(
    doc.links().some((link) => link.page() === 'Civil parishes in England'),
    'Bodmin: civil parishes in England link'
  )
  t.equal(
    doc.section('Sport and leisure').sentences()[2].links()[2].page(),
    'English rugby union system',
    "Bodmin: 'Sport and leisure' section, 3rd sentence links to 'English rugby union system'"
  )
  t.equal(
    doc.section('History').sentences()[1].links()[0].text(),
    'Norman conquest',
    "Bodmin: 'History' section, 2nd sentence shows 'Norman conquest' for Norman conquest of England"
  )
  t.equal(
    doc.section('Media').sentences()[0].text(),
    'The Cornish Guardian is a weekly newspaper published every Wednesday in seven separate editions, including the Bodmin edition.',
    "Bodmin: 'Media' section, 1st sentence text"
  )
  t.equal(doc.sections()[11].title(), 'Institutions', 'Bodmin: section [11] title')
  t.equal(doc.infobox().get('population').text(), '14,736', 'Bodmin: infobox population')
  t.equal(
    doc.section('Other sites').sentences()[4].links()[1].page(),
    'Thailand',
    "Bodmin: 'Other sites' section, 5th sentence links to 'Thailand'"
  )
  t.equal(doc.references()[39].title(), 'Fringe Magnetic – review', 'Bodmin: 40th reference title')
  t.ok(
    doc.section('Rebellions').sentences()[4].text().startsWith('In 1549, Cornishmen, allied with other rebels'),
    "Bodmin: 'Rebellions' section, 5th sentence starts 'In 1549, Cornishmen, allied wi…'"
  )
  t.equal(doc.lists()[5].lines()[3].text(), 'Bodmin manumissions', 'Bodmin: list 6, item 4')
  t.equal(
    doc.section('Other sites').sentences()[0].bolds()[0].text,
    'Bodmin Beacon Local Nature Reserve',
    "Bodmin: 'Other sites' section, 1st sentence bolds 'Bodmin Beacon Local Nature Reserve'"
  )
  t.equal(
    doc.images()[0].file(),
    'File:Ancient_Stone_Cross_on_Old_Callywith_Road_-_geograph.org.uk_-_757140.jpg',
    'Bodmin: 1st image file'
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
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'Tomahawk, Wisconsin',
    "Bradley-Community-Lincoln-County-Wisconsin: 2nd sentence links to 'Tomahawk, Wisconsin'"
  )
  t.equal(
    doc.sentences()[0].links()[0].text(),
    'unincorporated community',
    "Bradley-Community-Lincoln-County-Wisconsin: 1st sentence shows 'unincorporated community' for Unincorporated area"
  )
  t.equal(
    doc.sentences()[0].text(),
    'Bradley is an unincorporated community located in the town of Bradley, Lincoln County, Wisconsin, United States.',
    'Bradley-Community-Lincoln-County-Wisconsin: 1st sentence text'
  )
  t.equal(doc.sections()[1].title(), 'References', 'Bradley-Community-Lincoln-County-Wisconsin: section [1] title')
  t.equal(
    doc.infobox().get('area_code').text(),
    '715 & 534',
    'Bradley-Community-Lincoln-County-Wisconsin: infobox area_code'
  )
  t.equal(
    doc.sentences()[0].links()[2].page(),
    'Lincoln County, Wisconsin',
    "Bradley-Community-Lincoln-County-Wisconsin: 1st sentence links to 'Lincoln County, Wisconsin'"
  )
  t.equal(
    doc.categories()[1],
    'Unincorporated communities in Wisconsin',
    'Bradley-Community-Lincoln-County-Wisconsin: 2nd category'
  )
  t.equal(doc.sections().length, 2, 'Bradley-Community-Lincoln-County-Wisconsin: 2 sections')
  t.equal(
    doc.sentences()[1].links()[0].page(),
    'U.S. Route 8',
    "Bradley-Community-Lincoln-County-Wisconsin: 2nd sentence links to 'U.S. Route 8'"
  )
  t.equal(
    doc.sentences()[1].links()[1].text(),
    'Tomahawk',
    "Bradley-Community-Lincoln-County-Wisconsin: 2nd sentence shows 'Tomahawk' for Tomahawk, Wisconsin"
  )
  t.equal(
    doc.links()[6].page(),
    'Lincoln County, Wisconsin',
    "Bradley-Community-Lincoln-County-Wisconsin: link [6] is 'Lincoln County, Wisconsin'"
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
  t.ok(doc.section('awards'), 'Britt-Morgan: awards section')
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
  t.equal(
    doc.sentences()[1].links()[0].page(),
    'List of members of the AVN Hall of Fame',
    "Britt-Morgan: 2nd sentence links to 'List of members of the AVN Hall of Fame'"
  )
  t.equal(
    doc.sentences()[0].links()[0].text(),
    'pornographic actress',
    "Britt-Morgan: 1st sentence shows 'pornographic actress' for Pornographic film actor"
  )
  t.equal(doc.sentences()[1].text(), 'She is a member of the AVN Hall of Fame.', 'Britt-Morgan: 2nd sentence text')
  t.equal(doc.sections()[2].title(), 'References', 'Britt-Morgan: section [2] title')
  t.equal(
    doc.infobox().get('number_of_films').text(),
    '196 as actress, 9 as director (per IAFD)',
    'Britt-Morgan: infobox number_of_films'
  )
  t.equal(
    doc.sentences()[0].links()[0].page(),
    'Pornographic film actor',
    "Britt-Morgan: 1st sentence links to 'Pornographic film actor'"
  )
  t.equal(doc.references()[2].title(), 'AVN Awards Show - History', 'Britt-Morgan: 3rd reference title')
  t.equal(
    doc.lists()[0].lines()[0].text(),
    '1990 AVN Award – Best Screenplay, Video (Cheeks II: The Bitter End) with Jace Rocker',
    'Britt-Morgan: list 1, item 1'
  )
  t.equal(doc.images()[0].file(), 'File:Britt_Morgan.jpg', 'Britt-Morgan: 1st image file')
  t.equal(doc.categories()[3], 'Women pornographic film directors', 'Britt-Morgan: 4th category')
  t.equal(doc.sections().length, 4, 'Britt-Morgan: 4 sections')
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
  t.equal(
    doc.section('Geography').sentences()[0].links()[1].page(),
    'Arrondissement of Montreuil',
    "Canton-Of-Etaples: 'Geography' section, 1st sentence links to 'Arrondissement of Montreuil'"
  )
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'département',
    "Canton-Of-Etaples: 1st sentence shows 'département' for Departments of France"
  )
  t.equal(
    doc.sentences()[2].text(),
    'At the French canton reorganisation which came into effect in March 2015, the canton was reduced from 19 to 15 communes:',
    'Canton-Of-Etaples: 3rd sentence text'
  )
  t.equal(doc.sections()[6].title(), 'External links', 'Canton-Of-Etaples: section [6] title')
  t.equal(doc.infobox().get('pop').text(), '31363', 'Canton-Of-Etaples: infobox pop')
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'Arrondissement of Montreuil',
    "Canton-Of-Etaples: 2nd sentence links to 'Arrondissement of Montreuil'"
  )
  t.equal(doc.tables()[0].rows()[0]['1962'], '14870', "Canton-Of-Etaples: table 1, row 1, '1962' column")
  t.ok(
    doc.section('Geography').sentences()[0].text().startsWith('An area of coastland, small valleys and'),
    "Canton-Of-Etaples: 'Geography' section, 1st sentence starts 'An area of coastland, small va…'"
  )
  t.equal(doc.lists()[0].lines()[6].text(), 'Lefaux', 'Canton-Of-Etaples: list 1, item 7')
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'canton of Étaples ',
    "Canton-Of-Etaples: 1st sentence bolds 'canton of Étaples '"
  )
  t.equal(doc.sections().length, 7, 'Canton-Of-Etaples: 7 sections')
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
  t.equal(
    doc.sentences()[1].links()[0].page(),
    'College football',
    "Charlie-Milstead: 2nd sentence links to 'College football'"
  )
  t.equal(
    doc.sentences()[1].links()[2].text(),
    'drafted',
    "Charlie-Milstead: 2nd sentence shows 'drafted' for NFL Draft"
  )
  t.equal(
    doc.sentences()[5].text(),
    'On rushing, he ran for 3 yards on 3 carries.',
    'Charlie-Milstead: 6th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'References', 'Charlie-Milstead: section [2] title')
  t.equal(doc.infobox().get('draftround').text(), '14', 'Charlie-Milstead: infobox draftround')
  t.equal(doc.sentences()[0].links()[2].page(), 'Quarterback', "Charlie-Milstead: 1st sentence links to 'Quarterback'")
  t.ok(
    doc.sentences()[0].text().startsWith('Charles Frank Milstead (born November 21, 1937'),
    "Charlie-Milstead: 1st sentence starts 'Charles Frank Milstead (born N…'"
  )
  t.equal(doc.categories()[6], 'People from Tyler, Texas', 'Charlie-Milstead: 7th category')
  t.equal(doc.sections().length, 3, 'Charlie-Milstead: 3 sections')
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'Texas A&M University',
    "Charlie-Milstead: 2nd sentence links to 'Texas A&M University'"
  )
  t.equal(
    doc.links()[15].page(),
    'American Football League',
    "Charlie-Milstead: link [15] is 'American Football League'"
  )
  t.end()
})

test('Chemical-Biology', (t) => {
  const doc = wtf(readPage('Chemical-Biology'))
  t.equal(doc.title, 'Chemical biology', 'Chemical-Biology: discipline title')
  t.ok(
    doc.links().some((link) => link.page() === 'Chemistry'),
    'Chemical-Biology: related discipline link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Biology'),
    'Chemical-Biology: biology link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Physics'),
    'Chemical-Biology: physics link'
  )
  t.ok(doc.references().length > 0, 'Chemical-Biology: scientific sources')
  t.ok(
    doc.links().some((link) => link.page() === 'Chemical synthesis'),
    'Chemical-Biology: chemical synthesis link'
  )
  t.ok(doc.section('introduction'), 'Chemical-Biology: Introduction section')
  t.equal(
    doc.section('siRNA based therapeutics').sentences()[0].links()[0].page(),
    'SiRNA',
    "Chemical-Biology: 'siRNA based therapeutics' section, 1st sentence links to 'SiRNA'"
  )
  t.equal(
    doc.section('Protein misfolding and aggregation as a cause of disease').sentences()[1].links()[0].text(),
    'prion proteins',
    "Chemical-Biology: 'Protein misfolding and aggregation as a cause of disease' section, 2nd sentence shows 'prion proteins' for Prion"
  )
  t.equal(
    doc.section('Metal complexes targeting DNA').sentences()[0].text(),
    'DNA has been the primary target of metal complexes due to the ability of cationic metal interacting with the anionic backbone of DNA.',
    "Chemical-Biology: 'Metal complexes targeting DNA' section, 1st sentence text"
  )
  t.equal(
    doc.sections()[44].title(),
    'Fluorophores and techniques to tag proteins',
    'Chemical-Biology: section [44] title'
  )
  t.equal(
    doc.section('Protein misfolding and aggregation as a cause of disease').sentences()[1].links()[2].page(),
    'Bovine spongiform encephalopathy',
    "Chemical-Biology: 'Protein misfolding and aggregation as a cause of disease' section, 2nd sentence links to 'Bovine spongiform encephalopathy'"
  )
  t.equal(
    doc.tables()[1].rows()[2]['col1'],
    'What target(s) and off-targets does my molecule bind?',
    "Chemical-Biology: table 2, row 3, 'col1' column"
  )
  t.equal(
    doc.references()[31].title(),
    'Dry amyloid fibril assembly in a yeast prion peptide is mediated by long-lived structures containing water wires',
    'Chemical-Biology: 32nd reference title'
  )
  t.ok(
    doc
      .section('siRNA-A tool in chemical biology')
      .sentences()[3]
      .text()
      .startsWith('They have the potential to be powerful'),
    "Chemical-Biology: 'siRNA-A tool in chemical biology' section, 4th sentence starts 'They have the potential to be…'"
  )
  t.equal(doc.lists()[3].lines()[0].text(), 'What is my target?', 'Chemical-Biology: list 4, item 1')
  t.equal(
    doc.section('Chemical Biology Approaches to Characterize Molecular Pharmacology').sentences()[0].bolds()[0].text,
    'Molecular Pharmacology Characterization',
    "Chemical-Biology: 'Chemical Biology Approaches to Characterize Molecular Pharmacology' section, 1st sentence bolds 'Molecular Pharmacology Characterization'"
  )
  t.equal(doc.images()[1].file(), 'File:Stemcellmodulators.tif', 'Chemical-Biology: 2nd image file')
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
  t.ok(doc.section('personal'), 'Clint-Murchison-Sr: Personal section')
  t.ok(
    doc.categories().includes('American businesspeople in the oil industry'),
    'Clint-Murchison-Sr: American businesspeople in the oil industry category'
  )
  t.equal(
    doc.sentences()[7].links()[2].page(),
    'Wallis Simpson',
    "Clint-Murchison-Sr: 8th sentence links to 'Wallis Simpson'"
  )
  t.equal(
    doc.sentences()[5].links()[1].text(),
    'first lieutenant',
    "Clint-Murchison-Sr: 6th sentence shows 'first lieutenant' for First lieutenant"
  )
  t.equal(
    doc.section('Personal').sentences()[1].text(),
    'During World War I, Murchison served as a first lieutenant in the United States Army.',
    "Clint-Murchison-Sr: 'Personal' section, 2nd sentence text"
  )
  t.equal(doc.sections()[3].title(), 'Death', 'Clint-Murchison-Sr: section [3] title')
  t.equal(
    doc.sentences()[14].links()[2].page(),
    'Assassination of John F. Kennedy',
    "Clint-Murchison-Sr: 15th sentence links to 'Assassination of John F. Kennedy'"
  )
  t.equal(
    doc.references()[3].title(),
    'Windsor And Wife Leave For Visit in Tallahassee',
    'Clint-Murchison-Sr: 4th reference title'
  )
  t.ok(
    doc.sentences()[8].text().startsWith('In 1920, Murchison married Anne Morris from'),
    "Clint-Murchison-Sr: 8th sentence starts 'In 1920, Murchison married Ann…'"
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Clinton Williams "Clint" Murchison Sr.',
    'Clint-Murchison-Sr: 1st sentence bolds \'Clinton Williams "Clint" Murchison Sr.\''
  )
  t.equal(doc.categories()[1], 'Businesspeople from Texas', 'Clint-Murchison-Sr: 2nd category')
  t.equal(doc.sections().length, 7, 'Clint-Murchison-Sr: 7 sections')
  t.equal(
    doc.section('Death').sentences()[1].links()[0].page(),
    'Athens, Texas',
    "Clint-Murchison-Sr: 'Death' section, 2nd sentence links to 'Athens, Texas'"
  )
  t.end()
})

test('Damphu-Drum', (t) => {
  const doc = wtf(readPage('Damphu-Drum'))
  t.equal(doc.title, 'Damphu', 'Damphu-Drum: instrument name')
  t.ok(
    doc.links().some((link) => link.page() === 'Percussion instrument'),
    'Damphu-Drum: instrument classification link'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Tambourine'),
    'Damphu-Drum: related instrument link'
  )
  t.match(doc.images()[0].file(), /Damfu[ _]nepal\.jpg$/, 'Damphu-Drum: performance photograph')
  t.match(doc.text(), /Nepal/, 'Damphu-Drum: musical tradition')
  t.ok(doc.categories().includes('Nepalese musical instruments'), 'Damphu-Drum: Nepalese musical instruments category')
  t.ok(
    doc.links().some((link) => link.page() === 'Himalayan monal'),
    'Damphu-Drum: Himalayan monal link'
  )
  t.equal(
    doc.section('Types').sentences()[6].links()[1].page(),
    'Shamanism',
    "Damphu-Drum: 'Types' section, 7th sentence links to 'Shamanism'"
  )
  t.equal(
    doc.sentences()[1].links()[0].text(),
    'Tamang selo',
    "Damphu-Drum: 2nd sentence shows 'Tamang selo' for Music of Nepal"
  )
  t.equal(
    doc.sentences()[9].text(),
    'The circle created melodious sounds, trak dhin.',
    'Damphu-Drum: 10th sentence text'
  )
  t.equal(doc.sections()[5].title(), 'See also', 'Damphu-Drum: section [5] title')
  t.equal(doc.sentences()[17].links()[0].page(), 'Bamboo', "Damphu-Drum: 18th sentence links to 'Bamboo'")
  t.equal(doc.references()[2].title(), 'Traditional Folk Instrument Damphu', 'Damphu-Drum: 3rd reference title')
  t.ok(
    doc.section('Types').sentences()[0].text().startsWith('The damphu used generally in performances and'),
    "Damphu-Drum: 'Types' section, 1st sentence starts 'The damphu used generally in p…'"
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'Madal', 'Damphu-Drum: list 1, item 1')
  t.equal(doc.images()[0].file(), 'File:Damfu_nepal.jpg', 'Damphu-Drum: 1st image file')
  t.equal(doc.categories()[1], 'Nepalese culture', 'Damphu-Drum: 2nd category')
  t.equal(doc.images()[0].caption(), 'Performers using Damphu', 'Damphu-Drum: 1st image caption')
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
    doc.links().some((link) => link.page() === 'Representative democracy'),
    'Direct-Representation: representative democracy link'
  )
  t.equal(
    doc.sentences()[1].links()[0].page(),
    'Plurality voting system',
    "Direct-Representation: 2nd sentence links to 'Plurality voting system'"
  )
  t.equal(
    doc.sentences()[1].links()[0].text(),
    'winner-take-all',
    "Direct-Representation: 2nd sentence shows 'winner-take-all' for Plurality voting system"
  )
  t.equal(
    doc.sentences()[6].text(),
    'Suppose there is a congressional district with 400,000 residents eligible to vote and three candidates running to represent it, A, B, and C.',
    'Direct-Representation: 7th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'Benefits', 'Direct-Representation: section [2] title')
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'Plurality (voting)',
    "Direct-Representation: 2nd sentence links to 'Plurality (voting)'"
  )
  t.equal(doc.references()[1].title(), 'Direct Representation', 'Direct-Representation: 2nd reference title')
  t.ok(
    doc.sentences()[1].text().startsWith('This is in contrast to conventional forms'),
    "Direct-Representation: 2nd sentence starts 'This is in contrast to convent…'"
  )
  t.equal(doc.lists()[3].lines()[1].text(), 'Proxy voting', 'Direct-Representation: list 4, item 2')
  t.equal(doc.categories()[1], 'Democracy', 'Direct-Representation: 2nd category')
  t.equal(doc.sections().length, 7, 'Direct-Representation: 7 sections')
  t.equal(
    doc.section('Example').sentences()[5].links()[0].page(),
    'Robert Heinlein',
    "Direct-Representation: 'Example' section, 6th sentence links to 'Robert Heinlein'"
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
  t.equal(doc.coordinates()[0].lat, 39.18861, 'Dollar-Point-California: latitude')
  t.equal(doc.coordinates()[0].lon, -120.10889, 'Dollar-Point-California: longitude')
  t.equal(
    doc.infobox().get('settlement_type').text(),
    'census-designated place',
    'Dollar-Point-California: settlement classification'
  )
  t.ok(doc.section('demographics'), 'Dollar-Point-California: population section')
  t.ok(
    doc.links().some((link) => link.page() === 'Placer County, California'),
    'Dollar-Point-California: Placer County, California link'
  )
  t.ok(doc.section('history'), 'Dollar-Point-California: History section')
  t.equal(
    doc.sentences()[13].links()[1].page(),
    'Tahoe City, California',
    "Dollar-Point-California: 14th sentence links to 'Tahoe City, California'"
  )
  t.equal(
    doc.section('2010').sentences()[2].links()[2].text(),
    'Native American',
    "Dollar-Point-California: '2010' section, 3rd sentence shows 'Native American' for Native American (U.S. Census)"
  )
  t.equal(
    doc.sentences()[33].text(),
    'For every 100 females age 18 and over, there were 106.2 males.',
    'Dollar-Point-California: 34th sentence text'
  )
  t.equal(doc.sections()[6].title(), '2000', 'Dollar-Point-California: section [6] title')
  t.equal(doc.infobox().get('area_total_km2').text(), '4.232', 'Dollar-Point-California: infobox area_total_km2')
  t.equal(
    doc.sentences()[11].links()[0].page(),
    'Charles Lindbergh',
    "Dollar-Point-California: 12th sentence links to 'Charles Lindbergh'"
  )
  t.equal(
    doc.references()[5].title(),
    'US Gazetteer files: 2010, 2000, and 1990',
    'Dollar-Point-California: 6th reference title'
  )
  t.ok(
    doc.section('2000').sentences()[3].text().startsWith('The racial makeup of the CDP was'),
    "Dollar-Point-California: '2000' section, 4th sentence starts 'The racial makeup of the CDP w…'"
  )
  t.equal(
    doc.images()[0].file(),
    'File:Placer_County_California_Incorporated_and_Unincorporated_areas_Dollar_Point_Highlighted.svg',
    'Dollar-Point-California: 1st image file'
  )
  t.equal(doc.categories()[1], 'Lake Tahoe', 'Dollar-Point-California: 2nd category')
  t.equal(doc.section('2010').depth(), 1, "Dollar-Point-California: '2010' is a depth-1 subsection")
  t.end()
})

test('Elizabeth-Gilbert', (t) => {
  const doc = wtf(readPage('Elizabeth-Gilbert'))
  t.equal(doc.infobox().type(), 'writer', 'Elizabeth-Gilbert: writer infobox')
  t.equal(doc.infobox().get('name').text(), 'Elizabeth Gilbert', 'Elizabeth-Gilbert: writer name')
  t.match(doc.text(), /Eat, Pray, Love/, 'Elizabeth-Gilbert: best-known book')
  t.match(doc.images()[0].file(), /Elizabeth[ _]Gilbert[ _]at[ _]TED\.jpg$/, 'Elizabeth-Gilbert: author photograph')
  t.ok(doc.references().length > 0, 'Elizabeth-Gilbert: biographical sources')
  t.ok(doc.section('early life'), 'Elizabeth-Gilbert: Early life section')
  t.ok(
    doc.infoboxes().some((box) => box.get('occupation').text() === 'Novelist, memoirist'),
    'Elizabeth-Gilbert: occupation field'
  )
  t.equal(
    doc.section('Journalism').sentences()[2].links()[1].page(),
    'GQ',
    "Elizabeth-Gilbert: 'Journalism' section, 3rd sentence links to 'GQ'"
  )
  t.equal(doc.sentences()[4].links()[0].text(), 'Swedish', "Elizabeth-Gilbert: 5th sentence shows 'Swedish' for Swedes")
  t.equal(
    doc.section('Early life').sentences()[0].text(),
    'Gilbert was born in Waterbury, Connecticut.',
    "Elizabeth-Gilbert: 'Early life' section, 1st sentence text"
  )
  t.equal(doc.sections()[10].title(), 'Story collections', 'Elizabeth-Gilbert: section [10] title')
  t.equal(doc.infobox().get('notableworks').text(), 'Eat, Pray, Love (2006)', 'Elizabeth-Gilbert: infobox notableworks')
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'New York Times Best Seller list',
    "Elizabeth-Gilbert: 2nd sentence links to 'New York Times Best Seller list'"
  )
  t.equal(
    doc.references()[29].title(),
    "Elizabeth Gilbert's verified Facebook page",
    'Elizabeth-Gilbert: 30th reference title'
  )
  t.ok(
    doc.section('Eat, Pray, Love').sentences()[3].text().startsWith('The memoir was on the New York'),
    "Elizabeth-Gilbert: 'Eat, Pray, Love' section, 4th sentence starts 'The memoir was on the New York'"
  )
  t.equal(
    doc.lists()[4].lines()[0].text(),
    'The KGB Bar Reader: Buckle Bunnies (1998)',
    'Elizabeth-Gilbert: list 5, item 1'
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Elizabeth M. Gilbert',
    "Elizabeth-Gilbert: 1st sentence bolds 'Elizabeth M. Gilbert'"
  )
  t.equal(doc.images()[0].file(), 'File:Elizabeth_Gilbert_at_TED.jpg', 'Elizabeth-Gilbert: 1st image file')
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
  t.equal(
    doc.sentences()[2].links()[2].page(),
    'Monika Bejnar',
    "Ewelina-Setowska-Dryk: 3rd sentence links to 'Monika Bejnar'"
  )
  t.equal(
    doc.sentences()[0].links()[1].text(),
    'Polish',
    "Ewelina-Setowska-Dryk: 1st sentence shows 'Polish' for Poland"
  )
  t.equal(
    doc.sentences()[0].text(),
    'Ewelina Sętowska-Dryk (born 5 March 1980 in Puławy) is a Polish middle distance runner who specializes in the 800 metres.',
    'Ewelina-Setowska-Dryk: 1st sentence text'
  )
  t.equal(doc.sections()[2].title(), 'External links', 'Ewelina-Setowska-Dryk: section [2] title')
  t.equal(doc.sentences()[3].links()[0].page(), 'Rieti', "Ewelina-Setowska-Dryk: 4th sentence links to 'Rieti'")
  t.equal(doc.tables()[0].rows()[7]['col6'], '2:00.60', "Ewelina-Setowska-Dryk: table 1, row 8, 'col6' column")
  t.ok(
    doc.sentences()[1].text().startsWith('She finished fifth at the 2005 Summer'),
    "Ewelina-Setowska-Dryk: 2nd sentence starts 'She finished fifth at the 2005…'"
  )
  t.equal(doc.categories()[2], 'Polish female middle-distance runners', 'Ewelina-Setowska-Dryk: 3rd category')
  t.equal(doc.sections().length, 3, 'Ewelina-Setowska-Dryk: 3 sections')
  t.equal(
    doc.sentences()[2].links()[1].page(),
    '2006 European Championships in Athletics',
    "Ewelina-Setowska-Dryk: 3rd sentence links to '2006 European Championships in Athletics'"
  )
  t.equal(
    doc.sentences()[2].links()[1].text(),
    '2006 European Championships',
    "Ewelina-Setowska-Dryk: 3rd sentence shows '2006 European Championships' for 2006 European Championships in Athletics"
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
  t.equal(
    doc.section('History').sentences()[0].links()[0].page(),
    'Gangjin Kiln Sites',
    "Goryeo-Ware: 'History' section, 1st sentence links to 'Gangjin Kiln Sites'"
  )
  t.equal(
    doc.sentences()[5].links()[0].text(),
    'National Treasures of South Korea',
    "Goryeo-Ware: 6th sentence shows 'National Treasures of South Korea' for National Treasure (South Korea)"
  )
  t.equal(
    doc.section('History').sentences()[2].text(),
    'His work was documented in the short film Koryo Celadon in 1979.',
    "Goryeo-Ware: 'History' section, 3rd sentence text"
  )
  t.equal(doc.sections()[2].title(), 'Gallery', 'Goryeo-Ware: section [2] title')
  t.equal(doc.infobox().get('hangul').text(), '고려도자기, 고려청자, 고려자기', 'Goryeo-Ware: infobox hangul')
  t.equal(
    doc.section('History').sentences()[1].links()[1].page(),
    'Yu Geun-Hyeong',
    "Goryeo-Ware: 'History' section, 2nd sentence links to 'Yu Geun-Hyeong'"
  )
  t.equal(doc.lists()[0].lines()[1].text(), 'Buncheong', 'Goryeo-Ware: list 1, item 2')
  t.equal(doc.images()[1].file(), 'File:Goryeo_Celadon.jpg', 'Goryeo-Ware: 2nd image file')
  t.equal(doc.images()[3].caption(), 'Pitcher (National Treasure No. 116)', 'Goryeo-Ware: 4th image caption')
  t.equal(doc.sections().length, 6, 'Goryeo-Ware: 6 sections')
  t.equal(doc.sentences()[3].links()[1].page(), 'Yu Geun-Hyeong', "Goryeo-Ware: 4th sentence links to 'Yu Geun-Hyeong'")
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
    doc.links().some((link) => link.page() === 'Chess'),
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
  t.ok(doc.section('notable game'), 'Gregory-Serper: Notable game section')
  t.equal(doc.sentences()[5].links()[1].page(), 'Ivanchuk', "Gregory-Serper: 6th sentence links to 'Ivanchuk'")
  t.equal(
    doc.sentences()[13].links()[1].text(),
    'sacrifice',
    "Gregory-Serper: 14th sentence shows 'sacrifice' for Sacrifice (chess)"
  )
  t.equal(
    doc.sentences()[4].text(),
    'During his military service in Novosibirsk, he attended the 27th World Junior Chess Championship held in 1988 in Adelaide, Australia.',
    'Gregory-Serper: 5th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'References', 'Gregory-Serper: section [2] title')
  t.equal(
    doc.section('Notable game').sentences()[3].links()[1].page(),
    'Chess punctuation',
    "Gregory-Serper: 'Notable game' section, 4th sentence links to 'Chess punctuation'"
  )
  t.ok(
    doc.sentences()[5].text().startsWith('In this strong tournament Serper took 3rd'),
    "Gregory-Serper: 6th sentence starts 'In this strong tournament Serp…'"
  )
  t.equal(
    doc.lists()[0].lines()[1].text(),
    'US Chess Federation: Grandmaster Gregory Serper',
    'Gregory-Serper: list 1, item 2'
  )
  t.equal(
    doc.sentences()[20].bolds()[0].text,
    'axb5 21.axb5 Qxb5',
    "Gregory-Serper: 21st sentence bolds 'axb5 21.axb5 Qxb5'"
  )
  t.equal(doc.categories()[4], 'American chess players', 'Gregory-Serper: 5th category')
  t.equal(doc.sections().length, 4, 'Gregory-Serper: 4 sections')
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'Uzbek Soviet Socialist Republic',
    "Gregory-Serper: 2nd sentence links to 'Uzbek Soviet Socialist Republic'"
  )
  t.end()
})

test('Harry-McPherson', (t) => {
  const doc = wtf(readPage('Harry-McPherson'))
  t.equal(doc.infobox().get('name').text(), 'Harry McPherson', 'Harry-McPherson: official name')
  t.equal(doc.infobox().get('office').text(), 'White House Counsel', 'Harry-McPherson: office held')
  t.equal(doc.infobox().type(), 'officeholder', 'Harry-McPherson: political office infobox')
  t.match(doc.infobox().get('president').text(), /Lyndon Johnson/, 'Harry-McPherson: president served')
  t.match(doc.images()[0].file(), /McPherson[ _]DLA[ _]Piper\.jpg$/, 'Harry-McPherson: portrait')
  t.ok(
    doc.section('early life, education, military service'),
    'Harry-McPherson: Early life, education, military service section'
  )
  t.ok(
    doc.infoboxes().some((box) => box.get('term_start').text() === 'February 11, 1966'),
    'Harry-McPherson: term_start field'
  )
  t.equal(
    doc.section('Private law practice in Washington, D.C.').sentences()[7].links()[1].page(),
    'Bill Clinton',
    "Harry-McPherson: 'Private law practice in Washington, D.C.' section, 8th sentence links to 'Bill Clinton'"
  )
  t.equal(
    doc.sentences()[37].text(),
    'Our apprehension of the danger to us in the unification of Vietnam under Hanoi’s rule was the same in 1963 as it had been in 1954.',
    'Harry-McPherson: 38th sentence text'
  )
  t.equal(doc.sections()[7].title(), 'External links', 'Harry-McPherson: section [7] title')
  t.equal(doc.infobox().get('birth_place').text(), 'Tyler, Texas, U.S.', 'Harry-McPherson: infobox birth_place')
  t.equal(
    doc.section('Private law practice in Washington, D.C.').sentences()[10].links()[0].page(),
    'Council on Foreign Relations',
    "Harry-McPherson: 'Private law practice in Washington, D.C.' section, 11th sentence links to 'Council on Foreign Relations'"
  )
  t.equal(
    doc.references()[0].title(),
    'Harry McPherson Jr., adviser to President Johnson and D.C. lobbyist, dead at 82',
    'Harry-McPherson: 1st reference title'
  )
  t.ok(
    doc
      .section('Private law practice in Washington, D.C.')
      .sentences()[0]
      .text()
      .startsWith('Soon after Johnson left office, McPherson joined'),
    "Harry-McPherson: 'Private law practice in Washington, D.C.' section, 1st sentence starts 'Soon after Johnson left office…'"
  )
  t.equal(
    doc.lists()[2].lines()[1].text(),
    'Transcripts of 10 interviews with Harry C. McPherson, Jr. Lyndon Baines Johnson Library and Museum.',
    'Harry-McPherson: list 3, item 2'
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Harry Cummings McPherson, Jr.',
    "Harry-McPherson: 1st sentence bolds 'Harry Cummings McPherson, Jr.'"
  )
  t.equal(doc.images()[1].file(), 'File:McPherson_LBJ.jpg', 'Harry-McPherson: 2nd image file')
  t.equal(doc.categories()[4], 'Texas lawyers', 'Harry-McPherson: 5th category')
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
    doc.sentences()[0].text(),
    /1883/,
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: start of the rivalry'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Rugby union'),
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
  t.equal(
    doc.section('Records').sentences()[0].text(),
    'Note: Date shown in brackets indicates when the record was or last set.',
    "History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: 'Records' section, 1st sentence text"
  )
  t.equal(
    doc.sections()[4].title(),
    'Results',
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: section [4] title'
  )
  t.equal(
    doc.tables()[2].rows()[6]['date'],
    '12 February 2011',
    "History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: table 3, row 7, 'date' column"
  )
  t.ok(
    doc.sentences()[2].text().startsWith('Scotland and Wales play each other at'),
    "History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: 3rd sentence starts 'Scotland and Wales play each o…'"
  )
  t.equal(
    doc.section('Records').sentences()[0].bolds()[0].text,
    'Note:',
    "History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: 'Records' section, 1st sentence bolds 'Note:'"
  )
  t.equal(
    doc.categories()[3],
    'Sports rivalries in the United Kingdom',
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: 4th category'
  )
  t.equal(
    doc.section('Records').depth(),
    1,
    "History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: 'Records' is a depth-1 subsection"
  )
  t.equal(doc.sections().length, 6, 'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: 6 sections')
  t.equal(
    doc.links()[15].page(),
    'Cardiff',
    "History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: link [15] is 'Cardiff'"
  )
  t.ok(
    doc.templates('History of Tier 1 nations').length > 0,
    'History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: has a {{History of Tier 1 nations}} template'
  )
  t.equal(
    doc.links()[14].page(),
    'Millennium Stadium',
    "History-Of-Rugby-Union-Matches-Between-Scotland-And-Wales: link [14] is 'Millennium Stadium'"
  )
  t.end()
})

test('Irina-Saratovtseva', (t) => {
  const doc = wtf(readPage('Irina-Saratovtseva'))
  t.equal(doc.infobox().get('fullname').text(), 'Irina Saratovtseva', 'Irina-Saratovtseva: player name')
  t.equal(doc.infobox().type(), 'football biography', 'Irina-Saratovtseva: football biography infobox')
  t.equal(doc.infobox().get('name').text(), 'Irina Saratovtseva', 'Irina-Saratovtseva: display name')
  t.match(doc.images()[0].file(), /ISaratovtseva\.JPG$/, 'Irina-Saratovtseva: player photograph')
  t.match(doc.text(), /goalkeeper/i, 'Irina-Saratovtseva: playing position')
  t.ok(doc.categories().includes('1989 births'), 'Irina-Saratovtseva: 1989 births category')
  t.ok(
    doc.links().some((link) => link.page() === 'Kazakhstan'),
    'Irina-Saratovtseva: Kazakhstan link'
  )
  t.equal(
    doc.sentences()[4].links()[0].page(),
    "Kazakhstan women's national football team",
    "Irina-Saratovtseva: 5th sentence links to 'Kazakhstan women's national football team'"
  )
  t.equal(
    doc.sentences()[8].links()[0].text(),
    '2013 Euro qualifiers',
    "Irina-Saratovtseva: 9th sentence shows '2013 Euro qualifiers' for UEFA Women's Euro 2013 qualifying"
  )
  t.equal(
    doc.sentences()[4].text(),
    'She was also the first choice goalkeepèr of Kazakhstan in the 2011 World Cup qualifiers.',
    'Irina-Saratovtseva: 5th sentence text'
  )
  t.equal(doc.sections()[1].title(), 'References', 'Irina-Saratovtseva: section [1] title')
  t.equal(doc.infobox().get('clubs5').text(), 'Energiya Voronezh', 'Irina-Saratovtseva: infobox clubs5')
  t.equal(
    doc.sentences()[4].links()[1].page(),
    "2011 FIFA Women's World Cup qualification (UEFA)",
    "Irina-Saratovtseva: 5th sentence links to '2011 FIFA Women's World Cup qualification (UEFA)'"
  )
  t.ok(
    doc.sentences()[3].text().startsWith('In 2009, she signed for Zvezda Perm,'),
    "Irina-Saratovtseva: 4th sentence starts 'In 2009, she signed for Zvezda…'"
  )
  t.equal(doc.images()[0].file(), 'File:ISaratovtseva.JPG', 'Irina-Saratovtseva: 1st image file')
  t.equal(doc.categories()[10], 'Sporting de Huelva players', 'Irina-Saratovtseva: 11th category')
  t.equal(doc.sections().length, 2, 'Irina-Saratovtseva: 2 sections')
  t.equal(
    doc.sentences()[7].links()[0].page(),
    'Alfa-09 Kaliningrad',
    "Irina-Saratovtseva: 8th sentence links to 'Alfa-09 Kaliningrad'"
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
  t.ok(doc.section('personal life'), 'Jerry-Mumphrey: Personal life section')
  t.equal(
    doc.sentences()[3].links()[0].page(),
    'Dallas Green (baseball)',
    "Jerry-Mumphrey: 4th sentence links to 'Dallas Green (baseball)'"
  )
  t.equal(
    doc.sentences()[3].links()[0].text(),
    'Dallas Green',
    "Jerry-Mumphrey: 4th sentence shows 'Dallas Green' for Dallas Green (baseball)"
  )
  t.equal(
    doc.sentences()[4].text(),
    'Mumphrey and his wife, Gloria, live in Tyler, Texas.',
    'Jerry-Mumphrey: 5th sentence text'
  )
  t.equal(doc.sections()[3].title(), 'References', 'Jerry-Mumphrey: section [3] title')
  t.equal(doc.infobox().get('finalteam').text(), 'Chicago Cubs', 'Jerry-Mumphrey: infobox finalteam')
  t.equal(
    doc.sentences()[0].links()[2].page(),
    'San Diego Padres',
    "Jerry-Mumphrey: 1st sentence links to 'San Diego Padres'"
  )
  t.equal(doc.references()[0].title(), 'Jerry Mumphrey', 'Jerry-Mumphrey: 1st reference title')
  t.ok(
    doc.sentences()[2].text().startsWith("Along with San Diego Padres' teammates Gene"),
    "Jerry-Mumphrey: 3rd sentence starts 'Along with San Diego Padres' t…'"
  )
  t.equal(
    doc.lists()[0].lines()[0].text(),
    'List of Major League Baseball career stolen bases leaders',
    'Jerry-Mumphrey: list 1, item 1'
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Jerry Wayne Mumphrey',
    "Jerry-Mumphrey: 1st sentence bolds 'Jerry Wayne Mumphrey'"
  )
  t.equal(doc.categories()[2], 'African-American baseball players', 'Jerry-Mumphrey: 3rd category')
  t.end()
})

test('Jodie-Emery', (t) => {
  const doc = wtf(readPage('Jodie-Emery'))
  t.equal(doc.infobox().get('name').text(), 'Jodie Emery', 'Jodie-Emery: person name')
  t.match(doc.images()[0].file(), /Marc_Emery_and_Jodie_Emery\.JPG$/, 'Jodie-Emery: portrait filename')
  t.equal(doc.infobox().type(), 'person', 'Jodie-Emery: person infobox')
  t.equal(doc.infobox().get('nationality').text(), 'Canadian', 'Jodie-Emery: nationality')
  t.match(doc.infobox().get('caption').text(), /Toronto Freedom Festival 2010/, 'Jodie-Emery: photo caption')
  t.equal(doc.isRedirect(), false, 'Jodie-Emery: not-redirect')
  t.equal(doc.infobox().get('nationality').text(), 'Canadian', 'Jodie-Emery: nationality')
  t.equal(doc.infobox().json().template, 'Infobox person', 'Jodie-Emery: person template')
  t.equal(doc.sections()[0].sentences().length > 0, true, 'Jodie-Emery: intro-length')
  t.equal(doc.sections()[1].sentences().length > 0, true, 'Jodie-Emery: career-length')
  t.equal(doc.categories().length, 8, 'Jodie-Emery: cat-length')
  t.equal(doc.images().length, 1, 'Jodie-Emery: image-length')
  t.ok(doc.section('early life'), 'Jodie-Emery: Early life section')
  t.ok(
    doc.infoboxes().some((box) => box.get('other_names').text() === 'Princess of Pot'),
    'Jodie-Emery: other_names field'
  )
  t.equal(
    doc.sentences()[4].links()[2].page(),
    'Victoria, British Columbia',
    "Jodie-Emery: 5th sentence links to 'Victoria, British Columbia'"
  )
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'activist',
    "Jodie-Emery: 1st sentence shows 'activist' for Legality of cannabis"
  )
  t.equal(
    doc.section('Early life').sentences()[3].text(),
    'She and Marc Emery married on July 23, 2006.',
    "Jodie-Emery: 'Early life' section, 4th sentence text"
  )
  t.equal(doc.sections()[3].title(), 'Political career', 'Jodie-Emery: section [3] title')
  t.equal(doc.infobox().get('birth_date').text(), 'January 4, 1985', 'Jodie-Emery: infobox birth_date')
  t.equal(
    doc.section('Political career').sentences()[1].links()[1].page(),
    'Higher education in Canada',
    "Jodie-Emery: 'Political career' section, 2nd sentence links to 'Higher education in Canada'"
  )
  t.equal(doc.references()[1].title(), 'Post by Jodie Emery', 'Jodie-Emery: 2nd reference title')
  t.ok(
    doc.sentences()[14].text().startsWith('She is socially left-of-centre and advocates for'),
    "Jodie-Emery: 15th sentence starts 'She is socially left-of-centre…'"
  )
  t.equal(doc.lists()[0].lines()[1].text(), 'Cannabis Culture', 'Jodie-Emery: list 1, item 2')
  t.equal(doc.images()[0].file(), 'File:Marc_Emery_and_Jodie_Emery.JPG', 'Jodie-Emery: 1st image file')
  t.equal(doc.categories()[7], 'Liberal Party of Canada leadership candidates', 'Jodie-Emery: 8th category')
  t.end()
})

test('Julia-Kristeva', (t) => {
  const doc = wtf(readPage('Julia-Kristeva'))
  t.equal(doc.infobox().type(), 'philosopher', 'Julia-Kristeva: philosopher infobox')
  t.equal(doc.infobox().get('birth_name').text(), 'Юлия Кръстева', 'Julia-Kristeva: Cyrillic birth name')
  t.equal(doc.infobox().get('name').text(), 'Julia Kristeva', 'Julia-Kristeva: display name')
  t.match(doc.text(), /psychoanalyst/i, 'Julia-Kristeva: profession')
  t.match(doc.images()[0].file(), /Kristeva/, 'Julia-Kristeva: portrait filename')
  t.ok(
    doc.infoboxes().some((box) => box.get('residence').text() === 'France'),
    'Julia-Kristeva: residence field'
  )
  t.ok(doc.categories().includes('1941 births'), 'Julia-Kristeva: 1941 births category')
  t.equal(
    doc.section('Scholarly reception').sentences()[1].links()[0].page(),
    'Roland Barthes',
    "Julia-Kristeva: 'Scholarly reception' section, 2nd sentence links to 'Roland Barthes'"
  )
  t.equal(
    doc.sentences()[5].links()[0].text(),
    'structuralist',
    "Julia-Kristeva: 6th sentence shows 'structuralist' for Structuralism"
  )
  t.equal(
    doc.sentences()[12].text(),
    'On August 2, 1967, Kristeva married the novelist Philippe Sollers, né Philippe Joyaux.',
    'Julia-Kristeva: 13th sentence text'
  )
  t.equal(doc.sections()[11].title(), 'Novels', 'Julia-Kristeva: section [11] title')
  t.equal(doc.infobox().get('era').text(), 'Contemporary philosophy', 'Julia-Kristeva: infobox era')
  t.equal(doc.sentences()[37].links()[0].page(), 'Plato', "Julia-Kristeva: 38th sentence links to 'Plato'")
  t.equal(doc.references()[18].title(), 'Julia Kristeva and Feminist Thought', 'Julia-Kristeva: 19th reference title')
  t.ok(
    doc
      .section('Anthropology and psychology')
      .sentences()[0]
      .text()
      .startsWith('Kristeva argues that anthropology and psychology, or'),
    "Julia-Kristeva: 'Anthropology and psychology' section, 1st sentence starts 'Kristeva argues that anthropol…'"
  )
  t.equal(
    doc.lists()[0].lines()[5].text(),
    'In the Beginning Was Love: Psychoanalysis and Faith. New York: Columbia University Press, 1987.',
    'Julia-Kristeva: list 1, item 6'
  )
  t.equal(
    doc.section('Selected writings').sentences()[0].bolds()[0].text,
    'Other books on Julia Kristeva:',
    "Julia-Kristeva: 'Selected writings' section, 1st sentence bolds 'Other books on Julia Kristeva:'"
  )
  t.equal(doc.images()[0].file(), 'File:Kristeva_IMG_5888.jpg', 'Julia-Kristeva: 1st image file')
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
  t.equal(
    doc.sentences()[8].links()[0].page(),
    'Houston, Texas',
    "K-Nicole-Mitchell: 9th sentence links to 'Houston, Texas'"
  )
  t.equal(
    doc.sentences()[9].links()[0].text(),
    'Leonard Davis',
    "K-Nicole-Mitchell: 10th sentence shows 'Leonard Davis' for Leonard Davis (judge)"
  )
  t.equal(
    doc.section('Career').sentences()[2].text(),
    'After working for three years at Fulbright, Mitchell returned to the chambers of Judge Leonard Davis and served as his Chief Staff Attorney.',
    "K-Nicole-Mitchell: 'Career' section, 3rd sentence text"
  )
  t.equal(doc.sections()[1].title(), 'Education', 'K-Nicole-Mitchell: section [1] title')
  t.equal(doc.infobox().get('termstart').text(), 'August 16, 2013', 'K-Nicole-Mitchell: infobox termstart')
  t.equal(
    doc.sentences()[1].links()[1].page(),
    'St. Joseph High School (Victoria, Texas)',
    "K-Nicole-Mitchell: 2nd sentence links to 'St. Joseph High School (Victoria, Texas)'"
  )
  t.ok(
    doc
      .section('Education')
      .sentences()[1]
      .text()
      .startsWith("Mitchell received a bachelor's degree (initially majoring"),
    "K-Nicole-Mitchell: 'Education' section, 2nd sentence starts 'Mitchell received a bachelor's…'"
  )
  t.equal(
    doc.lists()[1].lines()[2].text(),
    "Baylor Law School News: Nicole Mitchell (JD '06) appointed U.S. Magistrate Judge for the Eastern District of Texas",
    'K-Nicole-Mitchell: list 2, item 3'
  )
  t.equal(
    doc.categories()[3],
    'Judges of the United States District Court for the Eastern District of Texas',
    'K-Nicole-Mitchell: 4th category'
  )
  t.equal(doc.sections().length, 6, 'K-Nicole-Mitchell: 6 sections')
  t.equal(doc.sentences()[2].links()[2].page(), 'Psychology', "K-Nicole-Mitchell: 3rd sentence links to 'Psychology'")
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
  t.equal(doc.sentences()[4].links()[0].page(), 'Haugesund', "Magnar-Saetre: 5th sentence links to 'Haugesund'")
  t.equal(
    doc.sentences()[2].links()[0].text(),
    'Norwegian Parliament',
    "Magnar-Saetre: 3rd sentence shows 'Norwegian Parliament' for Stortinget"
  )
  t.equal(
    doc.sentences()[2].text(),
    'He was elected to the Norwegian Parliament from Rogaland in 1989, and was re-elected on one occasion.',
    'Magnar-Saetre: 3rd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'References', 'Magnar-Saetre: section [1] title')
  t.equal(doc.categories()[2], 'Labour Party (Norway) politicians', 'Magnar-Saetre: 3rd category')
  t.equal(doc.sections().length, 2, 'Magnar-Saetre: 2 sections')
  t.equal(doc.links()[4].page(), 'Haugesund', "Magnar-Saetre: link [4] is 'Haugesund'")
  t.ok(
    doc.templates('Norway-politician-1940s-stub').length > 0,
    'Magnar-Saetre: has a {{Norway-politician-1940s-stub}} template'
  )
  t.equal(
    doc.sentences()[0].text(),
    'Magnar Sætre (12 November 1940 – 5 December 2002) was a Norwegian politician for the Labour Party.',
    'Magnar-Saetre: 1st sentence text'
  )
  t.equal(doc.categories()[3], 'Members of the Storting', 'Magnar-Saetre: 4th category')
  t.ok(doc.templates('stortingetbio').length > 0, 'Magnar-Saetre: has a {{stortingetbio}} template')
  t.end()
})

test('Neil-McLean-Saxophonist', (t) => {
  const doc = wtf(readPage('Neil-McLean-Saxophonist'))
  t.equal(doc.title, 'Neil McLean', 'Neil-McLean-Saxophonist: musician name')
  t.ok(
    doc.links().some((link) => link.page() === 'Ray Reach and Friends'),
    'Neil-McLean-Saxophonist: musical collaborators'
  )
  t.match(doc.sentences()[0].text(), /American saxophonist/, 'Neil-McLean-Saxophonist: occupation')
  t.match(doc.text(), /Tyler, Texas/, 'Neil-McLean-Saxophonist: residence')
  t.ok(
    doc.links().some((link) => link.type() === 'external'),
    'Neil-McLean-Saxophonist: external jazz ensemble link'
  )
  t.ok(doc.section('selected discography'), 'Neil-McLean-Saxophonist: Selected discography section')
  t.ok(doc.categories().includes('American saxophonists'), 'Neil-McLean-Saxophonist: American saxophonists category')
  t.equal(
    doc.sentences()[1].links()[2].page(),
    'Magic City Jazz Orchestra',
    "Neil-McLean-Saxophonist: 2nd sentence links to 'Magic City Jazz Orchestra'"
  )
  t.equal(
    doc.sentences()[0].text(),
    'Neil McLean is an American saxophonist now residing in Tyler, Texas.',
    'Neil-McLean-Saxophonist: 1st sentence text'
  )
  t.equal(doc.sections()[2].title(), 'External links', 'Neil-McLean-Saxophonist: section [2] title')
  t.equal(
    doc.sentences()[3].links()[0].page(),
    'SuperJazz Big Band',
    "Neil-McLean-Saxophonist: 4th sentence links to 'SuperJazz Big Band'"
  )
  t.ok(
    doc.sentences()[1].text().startsWith('As a member of the Henry Kimbrell'),
    "Neil-McLean-Saxophonist: 2nd sentence starts 'As a member of the Henry Kimbr…'"
  )
  t.equal(doc.lists()[1].lines()[1].text(), 'Lou Marini at All About Jazz', 'Neil-McLean-Saxophonist: list 2, item 2')
  t.equal(doc.categories()[2], 'Year of birth missing (living people)', 'Neil-McLean-Saxophonist: 3rd category')
  t.equal(doc.sections().length, 3, 'Neil-McLean-Saxophonist: 3 sections')
  t.equal(
    doc.sentences()[4].links()[0].page(),
    'Alabama Jazz Hall of Fame',
    "Neil-McLean-Saxophonist: 5th sentence links to 'Alabama Jazz Hall of Fame'"
  )
  t.equal(doc.links()[11].page(), 'Ellis Marsalis, Jr.', "Neil-McLean-Saxophonist: link [11] is 'Ellis Marsalis, Jr.'")
  t.equal(
    doc.links()[9].page(),
    'Alabama Jazz Hall of Fame',
    "Neil-McLean-Saxophonist: link [9] is 'Alabama Jazz Hall of Fame'"
  )
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
  t.equal(
    doc.sentences()[5].links()[1].page(),
    'USB communications device class',
    "RNDIS: 6th sentence links to 'USB communications device class'"
  )
  t.equal(
    doc.sentences()[6].links()[0].text(),
    'Android',
    "RNDIS: 7th sentence shows 'Android' for Android (operating system)"
  )
  t.equal(
    doc.sentences()[6].text(),
    'Some versions of Android include RNDIS USB functionality, while more recent versions (such as Nexus 6P in September 2016) do not.',
    'RNDIS: 7th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'External links', 'RNDIS: section [2] title')
  t.equal(
    doc.sentences()[0].links()[1].page(),
    'Proprietary protocol',
    "RNDIS: 1st sentence links to 'Proprietary protocol'"
  )
  t.equal(doc.references()[4].title(), "'CVS: cvs.openbsd.org: src' - MARC", 'RNDIS: 5th reference title')
  t.ok(
    doc.sentences()[2].text().startsWith('A partial RNDIS specification is available from'),
    "RNDIS: 3rd sentence starts 'A partial RNDIS specification…'"
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'Remote NDIS (RNDIS) and Windows', 'RNDIS: list 1, item 1')
  t.equal(doc.sections().length, 4, 'RNDIS: 4 sections')
  t.equal(doc.sentences()[1].links()[2].page(), 'Linux', "RNDIS: 2nd sentence links to 'Linux'")
  t.equal(doc.links()[5].page(), 'Linux', "RNDIS: link [5] is 'Linux'")
  t.end()
})

test('RNLI-Stations', (t) => {
  const doc = wtf(readPage('RNLI-Stations'))
  t.equal(doc.section('key').title(), 'Key', 'RNLI-Stations: table legend section')
  t.ok(doc.section('east division').tables().length > 0, 'RNLI-Stations: regional station table')
  t.equal(doc.categories().length, 5, 'RNLI-Stations: station list categories')
  t.ok(
    doc.images().some((image) => /Tenby/.test(image.file())),
    'RNLI-Stations: Tenby lifeboat station photograph'
  )
  t.equal(doc.section('east division').depth(), 1, 'RNLI-Stations: regional section depth')
  t.ok(doc.categories().includes('Ireland-related lists'), 'RNLI-Stations: Ireland-related lists category')
  t.ok(
    doc.links().some((link) => link.page() === 'Royal National Lifeboat Institution'),
    'RNLI-Stations: Royal National Lifeboat Institution link'
  )
  t.equal(doc.sentences()[2].links()[1].page(), 'Dorset', "RNLI-Stations: 3rd sentence links to 'Dorset'")
  t.equal(
    doc.sentences()[7].links()[0].text(),
    'inflatable boats',
    "RNLI-Stations: 8th sentence shows 'inflatable boats' for Arancia-class lifeboat"
  )
  t.equal(
    doc.section('Lifeboat types').sentences()[1].text(),
    'If more than one boat is provided they are sometimes stationed in separate buildings at different locations in the same town.',
    "RNLI-Stations: 'Lifeboat types' section, 2nd sentence text"
  )
  t.equal(doc.sections()[8].title(), 'West Division', 'RNLI-Stations: section [8] title')
  t.equal(doc.sentences()[0].links()[2].page(), 'British Isles', "RNLI-Stations: 1st sentence links to 'British Isles'")
  t.equal(
    doc.tables()[4].rows()[11]['name_and_number'],
    'Elizabeth Fairlie Ramsay',
    "RNLI-Stations: table 5, row 12, 'name_and_number' column"
  )
  t.equal(doc.references()[2].title(), 'Angle, Pembrokeshire Fleet', 'RNLI-Stations: 3rd reference title')
  t.ok(
    doc.sentences()[7].text().startsWith('The following lists do not include the'),
    "RNLI-Stations: 8th sentence starts 'The following lists do not inc…'"
  )
  t.equal(doc.lists()[3].lines()[0].text(), 'List of RNLB lifeboats', 'RNLI-Stations: list 4, item 1')
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Royal National Lifeboat Institution (RNLI) stations',
    "RNLI-Stations: 1st sentence bolds 'Royal National Lifeboat Institution (RNLI) stations'"
  )
  t.equal(
    doc.images()[1].file(),
    'File:Lifeboat_Station_-_Porthcawl_-_geograph.org.uk_-_1400792.jpg',
    'RNLI-Stations: 2nd image file'
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
  t.ok(doc.section('history'), 'Radiohead: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead: sources for the band history')
  t.ok(
    doc.links().some((link) => link.page() === 'Rock music'),
    'Radiohead: Rock music link'
  )
  t.ok(doc.section('1985–1992: formation and first years'), 'Radiohead: 1985–1992: Formation and first years section')
  t.equal(
    doc.section('Style').sentences()[3].links()[0].page(),
    'Post-Britpop',
    "Radiohead: 'Style' section, 4th sentence links to 'Post-Britpop'"
  )
  t.equal(
    doc.section('2002–2006: Hail to the Thief and solo work').sentences()[9].links()[2].text(),
    'Grammy Award for Best Engineered Album',
    "Radiohead: '2002–2006: Hail to the Thief and solo work' section, 10th sentence shows 'Grammy Award for Best Engineered Album' for Grammy Award for Best Engineered Album, Non-Classical"
  )
  t.equal(
    doc.section('2011–2012: The King of Limbs').sentences()[5].text(),
    'It was nominated for five categories in the 54th Grammy Awards.',
    "Radiohead: '2011–2012: The King of Limbs' section, 6th sentence text"
  )
  t.equal(doc.sections()[23].title(), 'Collaborators', 'Radiohead: section [23] title')
  t.equal(doc.infobox().get('years_active').text(), '1985–present', 'Radiohead: infobox years_active')
  t.equal(
    doc.section('Accolades').sentences()[5].links()[0].page(),
    'Rock and Roll Hall of Fame',
    "Radiohead: 'Accolades' section, 6th sentence links to 'Rock and Roll Hall of Fame'"
  )
  t.equal(doc.references()[34].title(), '500 Greatest Albums of All Time', 'Radiohead: 35th reference title')
  t.ok(
    doc
      .section('2017–2021: Hiatus and reissues')
      .sentences()[5]
      .text()
      .startsWith('In August, Yorke and Jonny Greenwood performed'),
    "Radiohead: '2017–2021: Hiatus and reissues' section, 6th sentence starts 'In August, Yorke and Jonny Gre…'"
  )
  t.equal(doc.lists()[1].lines()[1].text(), 'Chris Vatalaro – drums, percussion (2025)', 'Radiohead: list 2, item 2')
  t.equal(
    doc.section('Discography').sentences()[0].bolds()[0].text,
    'Studio albums',
    "Radiohead: 'Discography' section, 1st sentence bolds 'Studio albums'"
  )
  t.equal(doc.images()[4].file(), 'File:Radiohead_Matters.ogg', 'Radiohead: 5th image file')
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
  t.equal(doc.infoboxes()[0].get('clubname').text(), 'Raith Rovers', 'Raith-Rovers: clubname')
  t.equal(doc.categories().length, 10, 'Raith-Rovers: cat-length')
  t.equal(doc.images().length, 2, 'Raith-Rovers: img-length')
  t.equal(doc.images()[1].file(), "File:Stark's_Park_-_geograph.org.uk_-_204446.jpg", 'Raith-Rovers: img-file')
  t.equal(
    doc.images()[1].url(),
    `https://wikipedia.org/wiki/Special:Redirect/file/Stark's_Park_-_geograph.org.uk_-_204446.jpg`,
    'Raith-Rovers: image-url'
  )
  t.ok(doc.categories().includes('Raith Rovers F.C.'), 'Raith-Rovers: Raith Rovers F.C. category')
  t.ok(doc.categories().includes('Football clubs in Scotland'), 'Raith-Rovers: Football clubs in Scotland category')
  t.equal(
    doc.sentences()[28].links()[0].page(),
    'Canary Islands',
    "Raith-Rovers: 29th sentence links to 'Canary Islands'"
  )
  t.equal(doc.sentences()[2].links()[1].text(), 'Celtic', "Raith-Rovers: 3rd sentence shows 'Celtic' for Celtic F.C.")
  t.equal(
    doc.sentences()[13].text(),
    'Although it lends its name to many entities in the region, Raith is not itself a settlement.',
    'Raith-Rovers: 14th sentence text'
  )
  t.equal(
    doc.sentences()[3].links()[0].page(),
    'Scottish League Cup',
    "Raith-Rovers: 4th sentence links to 'Scottish League Cup'"
  )
  t.equal(doc.references()[18].title(), 'Weymss Cup', 'Raith-Rovers: 19th reference title')
  t.ok(
    doc.sentences()[14].text().startsWith('A Raith Rovers victory in the 1960s'),
    "Raith-Rovers: 15th sentence starts 'A Raith Rovers victory in the…'"
  )
  t.equal(doc.images()[0].file(), 'File:Raith_Rovers_F.C._Crest.png', 'Raith-Rovers: 1st image file')
  t.equal(doc.categories()[4], 'Football clubs in Fife', 'Raith-Rovers: 5th category')
  t.equal(doc.images()[1].caption(), "Stark's Park, home of Raith Rovers", 'Raith-Rovers: 2nd image caption')
  t.equal(
    doc.sentences()[35].links()[0].page(),
    'Willie McNaught',
    "Raith-Rovers: 36th sentence links to 'Willie McNaught'"
  )
  t.equal(
    doc.sentences()[7].links()[1].text(),
    'on aggregate',
    "Raith-Rovers: 8th sentence shows 'on aggregate' for Two-legged tie"
  )
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
  t.equal(
    doc.sentences()[2].links()[1].page(),
    'File system',
    "Remote-Application-Programming-Interface: 3rd sentence links to 'File system'"
  )
  t.equal(
    doc.sentences()[2].links()[0].text(),
    'registry',
    "Remote-Application-Programming-Interface: 3rd sentence shows 'registry' for Windows Registry"
  )
  t.equal(
    doc.sentences()[1].text(),
    'In other words, RAPI allows PC applications to call functions that are executed on the Pocket PC.',
    'Remote-Application-Programming-Interface: 2nd sentence text'
  )
  t.ok(
    doc.sentences()[0].text().startsWith('The Remote Application Programming Interface (RAPI) is'),
    "Remote-Application-Programming-Interface: 1st sentence starts 'The Remote Application Program…'"
  )
  t.equal(doc.links()[3].page(), 'File system', "Remote-Application-Programming-Interface: link [3] is 'File system'")
  t.ok(
    doc.templates('microsoft-software-stub').length > 0,
    'Remote-Application-Programming-Interface: has a {{microsoft-software-stub}} template'
  )
  t.equal(
    doc.sentences()[2].text(),
    'With RAPI, the registry, file system, database, and configuration of the Pocket PC device are available to the PC application.',
    'Remote-Application-Programming-Interface: 3rd sentence text'
  )
  t.ok(
    doc.templates('Microsoft APIs').length > 0,
    'Remote-Application-Programming-Interface: has a {{Microsoft APIs}} template'
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
    doc.links().some((link) => link.page() === 'Data access'),
    'Remote-Data-Objects: data access link'
  )
  t.ok(
    doc.categories().includes('Microsoft application programming interfaces'),
    'Remote-Data-Objects: Microsoft application programming interfaces category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Application programming interface'),
    'Remote-Data-Objects: application programming interface link'
  )
  t.equal(
    doc.sentences()[1].links()[0].page(),
    'Database connection',
    "Remote-Data-Objects: 2nd sentence links to 'Database connection'"
  )
  t.equal(
    doc.sentences()[1].text(),
    'This includes database connection, queries, stored procedures, result manipulation, and change commits.',
    'Remote-Data-Objects: 2nd sentence text'
  )
  t.equal(doc.sections()[2].title(), 'See also', 'Remote-Data-Objects: section [2] title')
  t.equal(
    doc.sentences()[2].links()[0].page(),
    'Open Database Connectivity',
    "Remote-Data-Objects: 3rd sentence links to 'Open Database Connectivity'"
  )
  t.ok(
    doc.sentences()[0].text().startsWith('Remote Data Objects (abbreviated RDO) is an'),
    "Remote-Data-Objects: 1st sentence starts 'Remote Data Objects (abbreviat…'"
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'Microsoft Data Access Components', 'Remote-Data-Objects: list 1, item 1')
  t.equal(doc.categories()[1], 'Database APIs', 'Remote-Data-Objects: 2nd category')
  t.equal(doc.sections().length, 4, 'Remote-Data-Objects: 4 sections')
  t.equal(
    doc.links()[8].page(),
    'Microsoft Data Access Components',
    "Remote-Data-Objects: link [8] is 'Microsoft Data Access Components'"
  )
  t.ok(doc.templates('windows-stub').length > 0, 'Remote-Data-Objects: has a {{windows-stub}} template')
  t.equal(doc.links()[5].page(), 'Operating systems', "Remote-Data-Objects: link [5] is 'Operating systems'")
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
  t.equal(doc.sentences()[2].links()[1].page(), 'XML', "Remote-Data-Services: 3rd sentence links to 'XML'")
  t.equal(
    doc.sentences()[2].text(),
    'Microsoft produced SOAP Toolkit 2.0, which allows clients to do this via an open XML-based standard.',
    'Remote-Data-Services: 3rd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'External links', 'Remote-Data-Services: section [1] title')
  t.equal(
    doc.sentences()[1].links()[2].page(),
    'Programming language',
    "Remote-Data-Services: 2nd sentence links to 'Programming language'"
  )
  t.ok(
    doc.sentences()[0].text().startsWith('Remote Data Services (RDS, formerly known as'),
    "Remote-Data-Services: 1st sentence starts 'Remote Data Services (RDS, for…'"
  )
  t.equal(
    doc.lists()[0].lines()[0].text(),
    'MSDN Remote Data Service (RDS) description',
    'Remote-Data-Services: list 1, item 1'
  )
  t.equal(doc.sections().length, 2, 'Remote-Data-Services: 2 sections')
  t.equal(doc.links()[7].page(), 'Programming language', "Remote-Data-Services: link [7] is 'Programming language'")
  t.equal(doc.links()[8].page(), 'Control flow', "Remote-Data-Services: link [8] is 'Control flow'")
  t.ok(
    doc.sentences()[1].text().startsWith('With the popular adoption of Transact-SQL, which'),
    "Remote-Data-Services: 2nd sentence starts 'With the popular adoption of T…'"
  )
  t.equal(
    doc.links()[10].page(),
    'Microsoft Data Access Components',
    "Remote-Data-Services: link [10] is 'Microsoft Data Access Components'"
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
    doc.section('routing and remote access service management pack'),
    'Routing-And-Remote-Access-Service: Routing and Remote Access Service Management Pack section'
  )
  t.ok(
    doc.categories().includes('Microsoft application programming interfaces'),
    'Routing-And-Remote-Access-Service: Microsoft application programming interfaces category'
  )
  t.equal(
    doc.sentences()[2].links()[1].page(),
    'Windows NT 4.0',
    "Routing-And-Remote-Access-Service: 3rd sentence links to 'Windows NT 4.0'"
  )
  t.equal(
    doc.sentences()[5].text(),
    'Point-to-Point Protocol (PPP), the protocol suite commonly used to negotiate point-to-point connections, has allowed them to be combined.',
    'Routing-And-Remote-Access-Service: 6th sentence text'
  )
  t.equal(doc.sections()[4].title(), 'See also', 'Routing-And-Remote-Access-Service: section [4] title')
  t.equal(
    doc.sentences()[7].links()[0].page(),
    'Dialog box',
    "Routing-And-Remote-Access-Service: 8th sentence links to 'Dialog box'"
  )
  t.ok(
    doc.sentences()[0].text().startsWith('Routing and Remote Access Service (RRAS) is'),
    "Routing-And-Remote-Access-Service: 1st sentence starts 'Routing and Remote Access Serv…'"
  )
  t.equal(
    doc.lists()[2].lines()[9].text(),
    'Static IP filter APIs for RRAS (replaced with Windows Filtering Platform APIs)',
    'Routing-And-Remote-Access-Service: list 3, item 10'
  )
  t.equal(doc.sections().length, 7, 'Routing-And-Remote-Access-Service: 7 sections')
  t.equal(
    doc.sentences()[6].links()[0].page(),
    'Client (computing)',
    "Routing-And-Remote-Access-Service: 7th sentence links to 'Client (computing)'"
  )
  t.equal(
    doc.links()[51].page(),
    'Password authentication protocol',
    "Routing-And-Remote-Access-Service: link [51] is 'Password authentication protocol'"
  )
  t.ok(doc.templates('Reflist').length > 0, 'Routing-And-Remote-Access-Service: has a {{Reflist}} template')
  t.equal(doc.links()[34].page(), 'RADIUS', "Routing-And-Remote-Access-Service: link [34] is 'RADIUS'")
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
  t.match(doc.images()[0].file(), /Royal_Cinema\.JPG$/, 'Royal-Cinema: cinema photograph')
  t.equal(doc.infobox().get('caption').text(), 'The Royal Cinema in 2009', 'Royal-Cinema: photo caption')
  t.equal(doc.infobox().json().template, 'Infobox venue', 'Royal-Cinema: venue template')
  t.equal(doc.sections()[0].sentences().length, 10, 'Royal-Cinema: sentence-length')
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
  t.equal(
    doc.sentences()[9].links()[0].page(),
    'The F Word (2013 film)',
    "Royal-Cinema: 10th sentence links to 'The F Word (2013 film)'"
  )
  t.equal(
    doc.sentences()[9].links()[0].text(),
    'The F Word',
    "Royal-Cinema: 10th sentence shows 'The F Word' for The F Word (2013 film)"
  )
  t.equal(
    doc.sentences()[9].text(),
    'The Royal was featured in the 2013 film The F Word.',
    'Royal-Cinema: 10th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'References', 'Royal-Cinema: section [2] title')
  t.equal(doc.infobox().get('address').text(), '608 College Street', 'Royal-Cinema: infobox address')
  t.equal(doc.sentences()[0].links()[1].page(), 'Movie theater', "Royal-Cinema: 1st sentence links to 'Movie theater'")
  t.equal(doc.references()[1].title(), 'The Best Place to Watch a Film in Toronto', 'Royal-Cinema: 2nd reference title')
  t.equal(doc.lists()[0].lines()[0].text(), 'List of cinemas in Toronto', 'Royal-Cinema: list 1, item 1')
  t.equal(doc.sentences()[6].bolds()[0].text, 'Theatre D', "Royal-Cinema: 7th sentence bolds 'Theatre D'")
  t.equal(doc.images()[0].file(), 'File:Royal_Cinema.JPG', 'Royal-Cinema: 1st image file')
  t.equal(doc.categories()[2], 'Streamline Moderne architecture in Canada', 'Royal-Cinema: 3rd category')
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
    doc.links().some((link) => link.page() === 'Proxy pattern'),
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
  t.equal(
    doc.sentences()[1].links()[0].page(),
    'Marshalling (computer science)',
    "Runtime-Callable-Wrapper: 2nd sentence links to 'Marshalling (computer science)'"
  )
  t.equal(
    doc.sentences()[0].links()[0].text(),
    'proxy',
    "Runtime-Callable-Wrapper: 1st sentence shows 'proxy' for Proxy pattern"
  )
  t.equal(
    doc.sentences()[4].text(),
    'The runtime maintains a single RCW per process for each object.',
    'Runtime-Callable-Wrapper: 5th sentence text'
  )
  t.equal(doc.sections()[1].title(), 'External links', 'Runtime-Callable-Wrapper: section [1] title')
  t.ok(
    doc.sentences()[0].text().startsWith('A Runtime Callable Wrapper (RCW) is a'),
    "Runtime-Callable-Wrapper: 1st sentence starts 'A Runtime Callable Wrapper (RC…'"
  )
  t.equal(
    doc.lists()[0].lines()[0].text(),
    'MSDN Runtime Callable Wrapper Reference',
    'Runtime-Callable-Wrapper: list 1, item 1'
  )
  t.equal(doc.categories()[4], 'Object models', 'Runtime-Callable-Wrapper: 5th category')
  t.equal(doc.sections().length, 2, 'Runtime-Callable-Wrapper: 2 sections')
  t.equal(
    doc.sentences()[1].links()[0].text(),
    'marshal',
    "Runtime-Callable-Wrapper: 2nd sentence shows 'marshal' for Marshalling (computer science)"
  )
  t.equal(
    doc.links()[4].page(),
    'Marshalling (computer science)',
    "Runtime-Callable-Wrapper: link [4] is 'Marshalling (computer science)'"
  )
  t.ok(doc.templates('compu-prog-stub').length > 0, 'Runtime-Callable-Wrapper: has a {{compu-prog-stub}} template')
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
    doc.links().some((link) => link.page() === 'Upper house'),
    'Senate-Of-Pakistan: upper house link'
  )
  t.ok(doc.section('history'), 'Senate-Of-Pakistan: History section')
  t.equal(
    doc.sentences()[31].links()[0].page(),
    'Chairman of the Senate of Pakistan',
    "Senate-Of-Pakistan: 32nd sentence links to 'Chairman of the Senate of Pakistan'"
  )
  t.equal(
    doc.sentences()[2].links()[1].text(),
    'Constitution',
    "Senate-Of-Pakistan: 3rd sentence shows 'Constitution' for Constitution of Pakistan"
  )
  t.equal(
    doc.section('History').sentences()[4].text(),
    'That Constitution was promulgated on 23 March 1956, which provided for a parliamentary form of Government with a unicameral legislature.',
    "Senate-Of-Pakistan: 'History' section, 5th sentence text"
  )
  t.equal(doc.sections()[4].title(), 'Relations between the Houses', 'Senate-Of-Pakistan: section [4] title')
  t.equal(
    doc.infobox().get('structure1').text(),
    'Senate of Pakistan, 2015.svg',
    'Senate-Of-Pakistan: infobox structure1'
  )
  t.equal(
    doc.sentences()[22].links()[1].page(),
    'Asif Ali Zardari',
    "Senate-Of-Pakistan: 23rd sentence links to 'Asif Ali Zardari'"
  )
  t.equal(
    doc.tables()[0].rows()[2]['province/territory'],
    'Sindh',
    "Senate-Of-Pakistan: table 1, row 3, 'province/territory' column"
  )
  t.equal(doc.references()[3].title(), 'Brief History of Senate', 'Senate-Of-Pakistan: 4th reference title')
  t.ok(
    doc.section('Appointment').sentences()[1].text().startsWith('(2) Election to fill seats in the'),
    "Senate-Of-Pakistan: 'Appointment' section, 2nd sentence starts '(2) Election to fill seats in…'"
  )
  t.equal(doc.lists()[3].lines()[1].text(), 'List of senators of Pakistan', 'Senate-Of-Pakistan: list 4, item 2')
  t.equal(doc.categories()[2], 'National upper houses', 'Senate-Of-Pakistan: 3rd category')
  t.end()
})

test('Terrence-Murphy-American-Football', (t) => {
  const doc = wtf(readPage('Terrence-Murphy-American-Football'))
  t.equal(doc.infobox().get('name').text(), 'Terrence Murphy', 'Terrence-Murphy-American-Football: player name')
  t.equal(doc.infobox().get('position').text(), 'Wide receiver', 'Terrence-Murphy-American-Football: football position')
  t.equal(doc.infobox().type(), 'nfl player', 'Terrence-Murphy-American-Football: NFL player infobox')
  t.match(doc.infobox().get('birth_place').text(), /Tyler, Texas/, 'Terrence-Murphy-American-Football: birthplace')
  t.ok(doc.references().length > 0, 'Terrence-Murphy-American-Football: career references')
  t.ok(doc.section('playing career'), 'Terrence-Murphy-American-Football: Playing career section')
  t.ok(
    doc.infoboxes().some((box) => box.get('number').text() === '85'),
    'Terrence-Murphy-American-Football: number field'
  )
  t.equal(
    doc.sentences()[27].links()[0].page(),
    'Brazos County, Texas',
    "Terrence-Murphy-American-Football: 28th sentence links to 'Brazos County, Texas'"
  )
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'return specialist',
    "Terrence-Murphy-American-Football: 1st sentence shows 'return specialist' for Special Teams"
  )
  t.equal(
    doc.sentences()[21].text(),
    'Tests later showed Murphy has spinal stenosis, a narrowing of the spine near the neck.',
    'Terrence-Murphy-American-Football: 22nd sentence text'
  )
  t.equal(doc.sections()[3].title(), 'College', 'Terrence-Murphy-American-Football: section [3] title')
  t.equal(doc.infobox().get('college').text(), 'Texas A&M', 'Terrence-Murphy-American-Football: infobox college')
  t.equal(
    doc.section('Post-coaching').sentences()[2].links()[0].page(),
    'Brazos County, Texas',
    "Terrence-Murphy-American-Football: 'Post-coaching' section, 3rd sentence links to 'Brazos County, Texas'"
  )
  t.equal(
    doc.references()[1].title(),
    'Murphy Returns To Green Bay As Coaching Intern',
    'Terrence-Murphy-American-Football: 2nd reference title'
  )
  t.ok(
    doc.sentences()[9].text().startsWith('He was a team captain twice, in'),
    "Terrence-Murphy-American-Football: 10th sentence starts 'He was a team captain twice, i…'"
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Terrence Cardene Murphy',
    "Terrence-Murphy-American-Football: 1st sentence bolds 'Terrence Cardene Murphy'"
  )
  t.equal(doc.categories()[3], 'American football wide receivers', 'Terrence-Murphy-American-Football: 4th category')
  t.equal(doc.section('NFL').depth(), 1, "Terrence-Murphy-American-Football: 'NFL' is a depth-1 subsection")
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
  t.equal(
    doc.sentences()[0].links()[2].page(),
    'Central District (Torbat-e Jam County)',
    "Teymanak-E-Olya: 1st sentence links to 'Central District (Torbat-e Jam County)'"
  )
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'Central District',
    "Teymanak-E-Olya: 1st sentence shows 'Central District' for Central District (Torbat-e Jam County)"
  )
  t.equal(
    doc.sentences()[1].text(),
    'At the 2006 census, its population was 559, in 117 families.',
    'Teymanak-E-Olya: 2nd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'References', 'Teymanak-E-Olya: section [1] title')
  t.equal(doc.infobox().get('subdivision_type1').text(), 'Province', 'Teymanak-E-Olya: infobox subdivision_type1')
  t.equal(doc.sentences()[0].links()[0].page(), 'Romanize', "Teymanak-E-Olya: 1st sentence links to 'Romanize'")
  t.equal(doc.sections().length, 2, 'Teymanak-E-Olya: 2 sections')
  t.equal(
    doc.sentences()[0].links()[1].page(),
    'Jolgeh-ye Musaabad Rural District',
    "Teymanak-E-Olya: 1st sentence links to 'Jolgeh-ye Musaabad Rural District'"
  )
  t.equal(doc.links()[12].page(), 'Romanize', "Teymanak-E-Olya: link [12] is 'Romanize'")
  t.ok(doc.templates('Portal').length > 0, 'Teymanak-E-Olya: has a {{Portal}} template')
  t.equal(doc.links()[2].page(), 'Provinces of Iran', "Teymanak-E-Olya: link [2] is 'Provinces of Iran'")
  t.end()
})

test('The-Atlas-Newspaper', (t) => {
  const doc = wtf(readPage('The-Atlas-Newspaper'))
  t.equal(doc.title, 'The Atlas', 'The-Atlas-Newspaper: newspaper title')
  t.ok(
    doc.links().some((link) => link.page() === 'Robert Stephen Rintoul'),
    'The-Atlas-Newspaper: founder link'
  )
  t.ok(doc.section('history'), 'The-Atlas-Newspaper: newspaper history section')
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
  t.equal(
    doc.section('Content').sentences()[1].links()[1].page(),
    'Leigh Hunt',
    "The-Atlas-Newspaper: 'Content' section, 2nd sentence links to 'Leigh Hunt'"
  )
  t.equal(
    doc.sentences()[2].links()[0].text(),
    'shilling',
    "The-Atlas-Newspaper: 3rd sentence shows 'shilling' for Shilling (British coin)"
  )
  t.equal(
    doc.sentences()[3].text(),
    'The price was gradually reduced (10 d in 1828, 8d in 1846, falling to 2d by 1858).',
    'The-Atlas-Newspaper: 4th sentence text'
  )
  t.equal(doc.sections()[3].title(), 'Notes', 'The-Atlas-Newspaper: section [3] title')
  t.equal(
    doc.section('Content').sentences()[0].links()[0].page(),
    'Whigs (British political party)',
    "The-Atlas-Newspaper: 'Content' section, 1st sentence links to 'Whigs (British political party)'"
  )
  t.ok(
    doc.section('History').sentences()[1].text().includes('the Atlas initially distinguished itself from its rivals'),
    "The-Atlas-Newspaper: 'History' section, 2nd sentence joins across the line-break"
  )
  t.equal(
    doc.lists()[0].lines()[0].text(),
    '"Atlas (1826-1869)", in Brake (ed.), Dictionary of Nineteenth-century Journalism in Great Britain and Ireland (2009).',
    'The-Atlas-Newspaper: list 1, item 1'
  )
  t.equal(doc.categories()[1], 'Publications established in 1826', 'The-Atlas-Newspaper: 2nd category')
  t.equal(doc.sections().length, 5, 'The-Atlas-Newspaper: 5 sections')
  t.equal(
    doc.sentences()[2].links()[0].page(),
    'Shilling (British coin)',
    "The-Atlas-Newspaper: 3rd sentence links to 'Shilling (British coin)'"
  )
  t.equal(
    doc.sentences()[4].links()[1].text(),
    'pro-temperance',
    "The-Atlas-Newspaper: 5th sentence shows 'pro-temperance' for Temperance movement"
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
  t.equal(
    doc.sentences()[4].links()[1].page(),
    'Pryse Gordon',
    "The-Field-Of-Waterloo: 5th sentence links to 'Pryse Gordon'"
  )
  t.equal(
    doc.sentences()[4].links()[0].text(),
    'general Adam',
    "The-Field-Of-Waterloo: 5th sentence shows 'general Adam' for Frederick Adam"
  )
  t.equal(
    doc.sentences()[7].text(),
    'Scott reluctantly agreed to tone the text down somewhat, but the poem was still very poorly received by critics.',
    'The-Field-Of-Waterloo: 8th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'External links', 'The-Field-Of-Waterloo: section [2] title')
  t.equal(
    doc.sentences()[9].links()[0].page(),
    'Thomas Erskine, 1st Baron Erskine',
    "The-Field-Of-Waterloo: 10th sentence links to 'Thomas Erskine, 1st Baron Erskine'"
  )
  t.ok(
    doc.sentences()[2].text().startsWith('Scott was hoping to recover his expenses'),
    "The-Field-Of-Waterloo: 4th sentence starts 'Scott was hoping to recover hi…'"
  )
  t.equal(doc.lists()[2].lines()[0].text(), 'Edinburgh University Library', 'The-Field-Of-Waterloo: list 3, item 1')
  t.equal(doc.categories()[1], '1815 poems', 'The-Field-Of-Waterloo: 2nd category')
  t.equal(doc.sections().length, 3, 'The-Field-Of-Waterloo: 3 sections')
  t.equal(
    doc.sentences()[1].links()[0].page(),
    'Battle of Waterloo',
    "The-Field-Of-Waterloo: 2nd sentence links to 'Battle of Waterloo'"
  )
  t.equal(
    doc.sentences()[9].links()[0].text(),
    'Lord Erskine',
    "The-Field-Of-Waterloo: 10th sentence shows 'Lord Erskine' for Thomas Erskine, 1st Baron Erskine"
  )
  t.end()
})

test('Toronto', (t) => {
  const doc = wtf(readPage('Toronto'))
  t.deepEqual(
    withoutWiki(doc.coordinates()[0]),
    { template: 'infobox/lat-long', lat: 43.7, lon: -79.4 },
    'Toronto: city coordinates'
  )
  t.equal(doc.title, 'Toronto', 'Toronto: city title')
  t.ok(
    doc.links().some((link) => link.page() === 'Ontario'),
    'Toronto: province link'
  )
  t.ok(doc.section('history'), 'Toronto: city history section')
  t.ok(
    doc.links().some((link) => link.page() === 'Lake Ontario'),
    'Toronto: waterfront location'
  )
  t.ok(doc.infoboxes().length > 0, 'Toronto: municipal infobox')
  t.ok(doc.section('before 1800'), 'Toronto: Before 1800 section')
  t.ok(
    doc.infoboxes().some((box) => box.get('official_name').text() === 'City of Toronto'),
    'Toronto: official_name field'
  )
  t.equal(
    doc.sentences()[30].links()[1].page(),
    'Front Street (Toronto)',
    "Toronto: 31st sentence links to 'Front Street (Toronto)'"
  )
  t.equal(
    doc.section('Government').sentences()[2].links()[1].text(),
    'chief executive',
    "Toronto: 'Government' section, 3rd sentence shows 'chief executive' for Head of government"
  )
  t.equal(
    doc.section('Architecture').sentences()[2].text(),
    'Bay-and-gable houses, mainly found in Old Toronto, are a distinct architectural feature of the city.',
    "Toronto: 'Architecture' section, 3rd sentence text"
  )
  t.equal(doc.sections()[8].title(), 'Cityscape', 'Toronto: section [8] title')
  t.equal(doc.infobox().get('leader_name1').text(), 'Norm Kelly', 'Toronto: infobox leader_name1')
  t.equal(
    doc.section('Before 1800').sentences()[0].links()[0].page(),
    'Iroquois people',
    "Toronto: 'Before 1800' section, 1st sentence links to 'Iroquois people'"
  )
  t.equal(doc.tables()[1].rows()[5]['percentage'], '7.6', "Toronto: table 2, row 6, 'percentage' column")
  t.equal(
    doc.references()[31].title(),
    'Environment Canada answers the question: Where was Toronto’s severe thunderstorm warning?',
    'Toronto: 32nd reference title'
  )
  t.ok(
    doc.sentences()[27].text().startsWith('In 1793, Governor John Graves Simcoe established'),
    "Toronto: 28th sentence starts 'In 1793, Governor John Graves…'"
  )
  t.equal(doc.lists()[0].lines()[3].text(), '8.5% Black', 'Toronto: list 1, item 4')
  t.equal(doc.images()[0].file(), 'File:Montage_of_Toronto_7.jpg', 'Toronto: 1st image file')
  t.end()
})

test('Toronto-Star', (t) => {
  const doc = wtf(readPage('Toronto-Star'))
  t.equal(doc.infobox().type(), 'newspaper', 'Toronto-Star: newspaper infobox')
  t.equal(doc.infobox().get('publisher').text(), 'John D. Cruickshank', 'Toronto-Star: publisher in this snapshot')
  t.ok(doc.section('history'), 'Toronto-Star: newspaper history section')
  t.match(doc.images()[0].file(), /Toronto[ _]Star[ _]frontpage/, 'Toronto-Star: front-page image')
  t.ok(doc.references().length > 0, 'Toronto-Star: newspaper references')
  t.equal(doc.infobox().get('publisher').text(), 'John D. Cruickshank', 'Toronto-Star: publisher.text')
  t.equal(doc.infobox().json().template, 'Infobox newspaper', 'Toronto-Star: newspaper template')
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
  t.equal(
    doc.sentences()[14].links()[0].page(),
    'One Yonge Street',
    "Toronto-Star: 15th sentence links to 'One Yonge Street'"
  )
  t.equal(
    doc.sentences()[19].links()[0].text(),
    '2003 blackout',
    "Toronto-Star: 20th sentence shows '2003 blackout' for Northeast blackout of 2003"
  )
  t.equal(
    doc.sentences()[26].text(),
    'Those without a digital subscription can view up to ten articles a month.',
    'Toronto-Star: 27th sentence text'
  )
  t.equal(doc.sections()[6].title(), 'Competitive position', 'Toronto-Star: section [6] title')
  t.equal(
    doc.infobox().get('image').text(),
    '[[File:Toronto Star frontpage.jpg|220px|border]]',
    'Toronto-Star: infobox image'
  )
  t.equal(
    doc.section('History').sentences()[2].links()[0].page(),
    'Joseph E. Atkinson',
    "Toronto-Star: 'History' section, 3rd sentence links to 'Joseph E. Atkinson'"
  )
  t.equal(doc.references()[30].title(), 'Star Media Group', 'Toronto-Star: 31st reference title')
  t.ok(
    doc.section('History').sentences()[5].text().startsWith('The Government of Canada Digital Collections website'),
    "Toronto-Star: 'History' section, 6th sentence starts 'The Government of Canada Digit…'"
  )
  t.equal(doc.lists()[4].lines()[4].text(), 'Jimmy Frise', 'Toronto-Star: list 5, item 5')
  t.equal(doc.sentences()[0].bolds()[0].text, 'Toronto Star', "Toronto-Star: 1st sentence bolds 'Toronto Star'")
  t.equal(doc.images()[1].file(), 'Image:Toronto_Star_Building.JPG', 'Toronto-Star: 2nd image file')
  t.equal(doc.isRedirect(), false, 'Toronto-Star: not-redirect')
  t.equal(doc.isDisambig(), false, 'Toronto-Star: not-disambig')
  t.equal(doc.infobox().json().template, 'Infobox newspaper', 'Toronto-Star: newspaper template')
  t.equal(doc.section('history').sentences().length, 21, 'Toronto-Star: history-length')
  t.equal(doc.categories().length, 6, 'Toronto-Star: cat-length')
  t.equal(doc.section('notable cartoonists').lists()[0].json().items.length, 10, 'Toronto-Star: cartoonist-length')
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
  t.equal(doc.sentences()[1].links()[0].page(), 'Sub Pop', "Tour-EP-Band-Of-Horses-EP: 2nd sentence links to 'Sub Pop'")
  t.equal(
    doc.sentences()[1].text(),
    "The self-released EP was initially sold at shows and was later made available in limited quantities at Sub Pop's website.",
    'Tour-EP-Band-Of-Horses-EP: 2nd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'Track listing', 'Tour-EP-Band-Of-Horses-EP: section [1] title')
  t.ok(
    doc.sentences()[2].text().startsWith('It features early versions of five tracks'),
    "Tour-EP-Band-Of-Horses-EP: 3rd sentence starts 'It features early versions of…'"
  )
  t.equal(
    doc.lists()[0].lines()[0].text(),
    'Band of Horses official website',
    'Tour-EP-Band-Of-Horses-EP: list 1, item 1'
  )
  t.equal(doc.categories()[5], 'Sub Pop EPs', 'Tour-EP-Band-Of-Horses-EP: 6th category')
  t.equal(doc.sections().length, 4, 'Tour-EP-Band-Of-Horses-EP: 4 sections')
  t.equal(doc.links()[3].page(), 'Sub Pop', "Tour-EP-Band-Of-Horses-EP: link [3] is 'Sub Pop'")
  t.ok(doc.templates('Tracklist').length > 0, 'Tour-EP-Band-Of-Horses-EP: has a {{Tracklist}} template')
  t.equal(doc.links()[2].page(), 'Indie rock', "Tour-EP-Band-Of-Horses-EP: link [2] is 'Indie rock'")
  t.equal(
    doc.sentences()[0].text(),
    'The Tour EP is an EP by Band of Horses, which preceded their debut album, Everything All the Time.',
    'Tour-EP-Band-Of-Horses-EP: 1st sentence text'
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
  t.ok(doc.section('history'), 'United-Kingdom: national history section')
  t.ok(
    doc.links().some((link) => link.page() === 'Great Britain'),
    'United-Kingdom: largest island link'
  )
  t.ok(doc.references().length > 0, 'United-Kingdom: country references')
  t.ok(
    doc.links().some((link) => link.page() === 'Sovereign state'),
    'United-Kingdom: sovereign state link'
  )
  t.ok(doc.section('etymology and terminology'), 'United-Kingdom: Etymology and terminology section')
  t.equal(
    doc.section('Sport').sentences()[6].links()[2].page(),
    '2012 Summer Olympics',
    "United-Kingdom: 'Sport' section, 7th sentence links to '2012 Summer Olympics'"
  )
  t.equal(
    doc.section('Geography').sentences()[4].links()[0].text(),
    'Royal Greenwich Observatory',
    "United-Kingdom: 'Geography' section, 5th sentence shows 'Royal Greenwich Observatory' for Royal Observatory, Greenwich"
  )
  t.equal(
    doc.section('Since World War II').sentences()[7].text(),
    'Over the next three decades, most colonies of the British Empire gained their independence.',
    "United-Kingdom: 'Since World War II' section, 8th sentence text"
  )
  t.equal(doc.sections()[15].title(), 'Law and criminal justice', 'United-Kingdom: section [15] title')
  t.equal(doc.infobox().get('image_map').text(), 'EU-United Kingdom.svg', 'United-Kingdom: infobox image_map')
  t.equal(
    doc.section('Devolved administrations').sentences()[9].links()[1].page(),
    'Carwyn Jones',
    "United-Kingdom: 'Devolved administrations' section, 10th sentence links to 'Carwyn Jones'"
  )
  t.equal(
    doc.tables()[1].rows()[8]['percentage_of_total_population_that_was_born_abroad'],
    '2.7',
    "United-Kingdom: table 2, row 9, 'percentage_of_total_population_that_was_born_abroad' column"
  )
  t.equal(
    doc.references()[26].title(),
    'Devolution of powers to Scotland, Wales and Northern Ireland',
    'United-Kingdom: 27th reference title'
  )
  t.ok(
    doc.section('Climate').sentences()[3].text().startsWith('Atlantic currents, warmed by the Gulf Stream,'),
    "United-Kingdom: 'Climate' section, 4th sentence starts 'Atlantic currents, warmed by t…'"
  )
  t.equal(doc.lists()[1].lines()[2].text(), '14||187', 'United-Kingdom: list 2, item 3')
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'United Kingdom of Great Britain and Northern Ireland',
    "United-Kingdom: 1st sentence bolds 'United Kingdom of Great Britain and Northern Ireland'"
  )
  t.end()
})

test('University-Of-Nevada-Reno-Arboretum', (t) => {
  const doc = wtf(readPage('University-Of-Nevada-Reno-Arboretum'))
  t.equal(doc.title, 'University of Nevada, Reno Arboretum', 'University-Of-Nevada-Reno-Arboretum: arboretum name')
  t.ok(doc.coordinates().length > 0, 'University-Of-Nevada-Reno-Arboretum: arboretum location')
  t.ok(
    doc.links().some((link) => link.page() === 'Arboretum'),
    'University-Of-Nevada-Reno-Arboretum: arboretum classification link'
  )
  t.equal(doc.coordinates()[0].lat, 39.54583, 'University-Of-Nevada-Reno-Arboretum: latitude')
  t.equal(doc.coordinates()[0].lon, -119.81667, 'University-Of-Nevada-Reno-Arboretum: longitude')
  t.ok(
    doc.categories().includes('1985 establishments in Nevada'),
    'University-Of-Nevada-Reno-Arboretum: 1985 establishments in Nevada category'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Reno, Nevada'),
    'University-Of-Nevada-Reno-Arboretum: Reno, Nevada link'
  )
  t.equal(
    doc.sentences()[2].links()[0].page(),
    'Elm',
    "University-Of-Nevada-Reno-Arboretum: 3rd sentence links to 'Elm'"
  )
  t.equal(
    doc.sentences()[2].text(),
    'Thirty-six mature elm trees line the Quad.',
    'University-Of-Nevada-Reno-Arboretum: 3rd sentence text'
  )
  t.equal(doc.sections()[3].title(), 'External links', 'University-Of-Nevada-Reno-Arboretum: section [3] title')
  t.equal(
    doc.references()[2].title(),
    'Arboretum Board: Areas of Interest',
    'University-Of-Nevada-Reno-Arboretum: 3rd reference title'
  )
  t.ok(
    doc.sentences()[1].text().startsWith('The arboretum was established in 1985 and'),
    "University-Of-Nevada-Reno-Arboretum: 2nd sentence starts 'The arboretum was established…'"
  )
  t.equal(
    doc.lists()[0].lines()[5].text(),
    'Merriam A. Brown Rose Garden – roses.',
    'University-Of-Nevada-Reno-Arboretum: list 1, item 6'
  )
  t.equal(doc.categories()[1], 'Arboreta in Nevada', 'University-Of-Nevada-Reno-Arboretum: 2nd category')
  t.equal(doc.sections().length, 4, 'University-Of-Nevada-Reno-Arboretum: 4 sections')
  t.equal(
    doc.links()[41].page(),
    'List of botanical gardens and arboretums in the United States',
    "University-Of-Nevada-Reno-Arboretum: link [41] is 'List of botanical gardens and arboretums in the United States'"
  )
  t.ok(doc.templates('Reflist').length > 0, 'University-Of-Nevada-Reno-Arboretum: has a {{Reflist}} template')
  t.equal(doc.links()[5].page(), 'Elm', "University-Of-Nevada-Reno-Arboretum: link [5] is 'Elm'")
  t.end()
})

test('Willow', (t) => {
  const doc = wtf(readPage('Willow'))
  t.match(doc.text(), /Salix/, 'Willow: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salix alba'),
    'Willow: botanical link'
  )
  t.ok(doc.section('description'), 'Willow: botanical section')
  t.ok(doc.images().length > 0, 'Willow: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow: botanical categories')
  t.match(doc.text(), /deciduous/, 'Willow: deciduous growth habit')
  t.ok(doc.categories().includes('Dioecious plants'), 'Willow: Dioecious plants category')
  t.equal(
    doc.section('Weeds').sentences()[0].links()[2].page(),
    'Weeping tile',
    "Willow: 'Weeds' section, 1st sentence links to 'Weeping tile'"
  )
  t.equal(
    doc.section('Uses').sentences()[1].links()[0].text(),
    'start fires by friction',
    "Willow: 'Uses' section, 2nd sentence shows 'start fires by friction' for Friction fire"
  )
  t.equal(
    doc.section('Leaves').sentences()[6].text(),
    'Usually they are serrate, rounded at base, acute or acuminate.',
    "Willow: 'Leaves' section, 7th sentence text"
  )
  t.equal(doc.sections()[23].title(), 'External links', 'Willow: section [23] title')
  t.equal(doc.infobox().get('type_species_authority').text(), 'L.', 'Willow: infobox type_species_authority')
  t.equal(doc.sentences()[28].links()[0].page(), 'Type species', "Willow: 29th sentence links to 'Type species'")
  t.equal(
    doc.references()[27].title(),
    'Proverbs 30:18–19 in the light of ancient mesopotamian cuneiform texts',
    'Willow: 28th reference title'
  )
  t.ok(
    doc.section('Modern medicinal uses').sentences()[6].text().startsWith('There are now many papers, books and'),
    "Willow: 'Modern medicinal uses' section, 7th sentence starts 'There are now many papers, boo…'"
  )
  t.equal(
    doc.lists()[4].lines()[0].text(),
    'International Register of Cultivars of Salix L. (willow)',
    'Willow: list 5, item 1'
  )
  t.equal(doc.images()[0].file(), 'File:Salix_alba_Morton.jpg', 'Willow: 1st image file')
  t.equal(doc.categories()[2], 'Medicinal plants', 'Willow: 3rd category')
  t.end()
})

test('Wimbledon-Championships', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'All England Lawn Tennis and Croquet Club'),
    'Wimbledon-Championships: tennis or venue link'
  )
  t.ok(doc.section('history'), 'Wimbledon-Championships: tournament history or programme section')
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
  t.equal(
    doc.section('Colours and uniforms').sentences()[4].links()[0].page(),
    'Martina Navratilova',
    "Wimbledon-Championships: 'Colours and uniforms' section, 5th sentence links to 'Martina Navratilova'"
  )
  t.equal(
    doc.section('Sponsorship').sentences()[2].links()[1].text(),
    'fruit squash',
    "Wimbledon-Championships: 'Sponsorship' section, 3rd sentence shows 'fruit squash' for Squash (drink)"
  )
  t.equal(
    doc.section('Ball boys and ball girls').sentences()[2].text(),
    "Prior to this, from the 1920s onwards, the ball boys came from The Shaftesbury Children's Home.",
    "Wimbledon-Championships: 'Ball boys and ball girls' section, 3rd sentence text"
  )
  t.equal(doc.sections()[37].title(), 'Ranking points', 'Wimbledon-Championships: section [37] title')
  t.equal(
    doc.section('Players and seeding').sentences()[6].links()[0].page(),
    '1927 Wimbledon Championships',
    "Wimbledon-Championships: 'Players and seeding' section, 7th sentence links to '1927 Wimbledon Championships'"
  )
  t.equal(doc.tables()[1].rows()[2]['col4'], '£174,000', "Wimbledon-Championships: table 2, row 3, 'col4' column")
  t.equal(
    doc.references()[6].title(),
    "Wimbledon's strawberries and cream has Tudor roots",
    'Wimbledon-Championships: 7th reference title'
  )
  t.ok(
    doc.section('Trophies').sentences()[0].text().startsWith("The Gentlemen's Singles champion is presented with"),
    "Wimbledon-Championships: 'Trophies' section, 1st sentence starts 'The Gentlemen's Singles champi…'"
  )
  t.equal(doc.lists()[2].lines()[3].text(), "Gentlemen's Wheelchair Singles", 'Wimbledon-Championships: list 3, item 4')
  t.equal(doc.images()[6].file(), 'File:Wimbledon_court_No._1.JPG', 'Wimbledon-Championships: 7th image file')
  t.equal(doc.categories()[12], 'Tennis tournaments in London', 'Wimbledon-Championships: 13th category')
  t.end()
})
