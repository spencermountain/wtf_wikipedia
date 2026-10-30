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
  t.equal(doc.infobox().get('naam').text(), 'Groot-Brittanje', 'Groot-Brittanje: Afrikaans island name field')
  t.ok(
    doc.links().some((link) => link.page() === 'Koninkryk van Groot-Brittanje'),
    'Groot-Brittanje: historical kingdom link'
  )
  t.ok(doc.categories().length > 0, 'Groot-Brittanje: Afrikaans categories are recognized')
  t.ok(
    doc.section('staatkundige gebiede geassosieer met groot-brittanje'),
    'Groot-Brittanje: Staatkundige gebiede geassosieer met Groot-Brittanje section'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Europa'),
    'Groot-Brittanje: European location link'
  )
  t.equal(doc.sentences()[2].links()[2].page(), 'Wallis', "Groot-Brittanje: 3rd sentence links to 'Wallis'")
  t.equal(
    doc.sentences()[1].text(),
    'Dit is geleë aan die weskus van die vasteland van Europa en is die hoofgebied van die Verenigde Koninkryk.',
    'Groot-Brittanje: 2nd sentence text'
  )
  t.equal(
    doc.sections()[2].title(),
    'Ander staatkundige gebiede in die Britse Eilande',
    'Groot-Brittanje: section [2] title'
  )
  t.equal(doc.infobox().get('argipel').text(), 'Britse Eilande', 'Groot-Brittanje: infobox argipel')
  t.equal(doc.sentences()[2].links()[1].page(), 'Skotland', "Groot-Brittanje: 3rd sentence links to 'Skotland'")
  t.ok(
    doc.sentences()[2].text().startsWith('Die term Groot-Brittanje word ook gebruik as'),
    "Groot-Brittanje: 3rd sentence starts 'Die term Groot-Brittanje word…'"
  )
  t.equal(doc.lists()[2].lines()[2].text(), 'Noord-Ierland', 'Groot-Brittanje: list 3, item 3')
  t.equal(
    doc.images()[0].file(),
    'File:Satellite_image_of_Great_Britain_and_Northern_Ireland_in_April_2002.jpg',
    'Groot-Brittanje: 1st image file'
  )
  t.equal(doc.images()[0].caption(), 'Satellietbeeld van Groot-Brittanje.', 'Groot-Brittanje: 1st image caption')
  t.equal(doc.sections().length, 4, 'Groot-Brittanje: 4 sections')
  t.equal(doc.sentences()[0].links()[1].page(), 'Wallies', "Groot-Brittanje: 1st sentence links to 'Wallies'")
  t.end()
})

test('Mark-Behr', (t) => {
  const doc = wtf(readPage('Mark-Behr'))
  t.equal(doc.infobox().get('naam').text(), 'Mark Behr', 'Mark-Behr: Afrikaans name field')
  t.equal(doc.infobox().get('geboortenaam').text(), 'Mark Carl Behr', 'Mark-Behr: Afrikaans birth name field')
  t.match(doc.text(), /Afrikaans/, 'Mark-Behr: writing language')
  t.ok(
    doc.links().some((link) => link.page() === '19 Oktober'),
    'Mark-Behr: birth date link'
  )
  t.ok(doc.references().length > 0, 'Mark-Behr: biographical references')
  t.ok(
    doc.infoboxes().some((box) => box.get('beroep').text() === 'Skrywer, akademikus'),
    'Mark-Behr: beroep field'
  )
  t.ok(doc.categories().includes('Suid-Afrikaanse skrywers'), 'Mark-Behr: Suid-Afrikaanse skrywers category')
  t.equal(
    doc.section('Lewe en werk').sentences()[3].links()[0].page(),
    'KwaZulu-Natal',
    "Mark-Behr: 'Lewe en werk' section, 4th sentence links to 'KwaZulu-Natal'"
  )
  t.equal(
    doc.sentences()[24].links()[0].text(),
    'Literatuur',
    "Mark-Behr: 25th sentence shows 'Literatuur' for Letterkunde"
  )
  t.equal(
    doc.sentences()[34].text(),
    'Later gee hy ook jaarliks klas in die Universiteit van die Witwatersrand se meestersprogram vir skryfkuns.',
    'Mark-Behr: 35th sentence text'
  )
  t.equal(doc.sections()[6].title(), 'Boeke', 'Mark-Behr: section [6] title')
  t.equal(doc.infobox().get('sterfteplek').text(), 'Johannesburg', 'Mark-Behr: infobox sterfteplek')
  t.equal(
    doc.section('Skryfwerk').sentences()[2].links()[1].page(),
    'Antjie Krog',
    "Mark-Behr: 'Skryfwerk' section, 3rd sentence links to 'Antjie Krog'"
  )
  t.equal(
    doc.tables()[0].rows()[2]['publikasie'],
    'Kings of the water',
    "Mark-Behr: table 1, row 3, 'publikasie' column"
  )
  t.ok(
    doc.sentences()[18].text().startsWith('Hier raak hy as spioen vir die'),
    "Mark-Behr: 19th sentence starts 'Hier raak hy as spioen vir die'"
  )
  t.equal(
    doc.lists()[2].lines()[5].text(),
    'Vosloo, Johan “Spioen se ‘appels’ nou vrot” “Rapport” 14 Julie 1996',
    'Mark-Behr: list 3, item 6'
  )
  t.equal(doc.categories()[1], 'Geboortes in 1963', 'Mark-Behr: 2nd category')
  t.equal(
    doc.section('Tydskrifte en koerante').depth(),
    1,
    "Mark-Behr: 'Tydskrifte en koerante' is a depth-1 subsection"
  )
  t.equal(doc.isRedirect(), false, 'Mark-Behr: not-redirect')
  t.equal(doc.infoboxes().length, 1, 'Mark-Behr: got infobox')
  t.equal(doc.categories().length, 3, 'Mark-Behr: cat-length')
  t.equal(doc.section('publikasies').title(), 'Publikasies', 'Mark-Behr: reference stripped from heading')
  t.equal(doc.section('publikasies').tables().length, 1, 'Mark-Behr: got table')
  t.equal(doc.tables()[0].links().length, 0, 'Mark-Behr: table has no links')
  t.equal(doc.section('publikasies').lists().length, 0, 'Mark-Behr: no list')
  t.equal(doc.section('toekennings').lists().length, 1, 'Mark-Behr: got list')
  t.equal(doc.section('toekennings').lists()[0].lines().length, 4, 'Mark-Behr: got 4 items in list')
  t.end()
})
