import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('The-Starry-Night-Sv', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Sv'))
  t.match(doc.text(), /Stjärnenatt/, 'The-Starry-Night-Sv: Swedish painting title')
  t.match(doc.text(), /1889/, 'The-Starry-Night-Sv: year of creation')
  t.ok(
    doc.links().some((link) => link.page() === 'Vincent van Gogh'),
    'The-Starry-Night-Sv: artist link'
  )
  t.ok(doc.section('kronologi').lists()[0], 'The-Starry-Night-Sv: ownership chronology')
  t.ok(doc.references().length > 0, 'The-Starry-Night-Sv: art history sources')
  t.ok(doc.section('historik och tema'), 'The-Starry-Night-Sv: Historik och tema section')
  t.ok(
    doc.links().some((link) => link.page() === 'Museum of Modern Art'),
    'The-Starry-Night-Sv: museum collection link'
  )
  t.equal(doc.sentences()[18].links()[0].page(), 'Nedan', "The-Starry-Night-Sv: 19th sentence links to 'Nedan'")
  t.equal(
    doc.sentences()[16].links()[2].text(),
    'vetefältet',
    "The-Starry-Night-Sv: 17th sentence shows 'vetefältet' for Vete"
  )
  t.equal(
    doc.section('Proveniens').sentences()[4].text(),
    '1900 sålde hon Stjärnenatt till poeten Julien Leclercq, som i sin tur året därpå sålde tavlan vidare till Gauguins vän Émile Schuffenecker.',
    "The-Starry-Night-Sv: 'Proveniens' section, 5th sentence text"
  )
  t.equal(doc.sections()[4].title(), 'Proveniens', 'The-Starry-Night-Sv: section [4] title')
  t.equal(
    doc.section('Motiv').sentences()[7].links()[2].page(),
    'Vete',
    "The-Starry-Night-Sv: 'Motiv' section, 8th sentence links to 'Vete'"
  )
  t.ok(
    doc.sentences()[8].text().startsWith('Stjärnenatt kom till runt eller strax före'),
    "The-Starry-Night-Sv: 9th sentence starts 'Stjärnenatt kom till runt elle…'"
  )
  t.equal(
    doc.lists()[0].lines()[6].text(),
    '1906–1938 – Georgette P. van Stolk, Rotterdam',
    'The-Starry-Night-Sv: list 1, item 7'
  )
  t.equal(doc.images()[0].file(), 'File:Van_Gogh_Starry_Night_Drawing.jpg', 'The-Starry-Night-Sv: 1st image file')
  t.equal(doc.categories()[4], 'Målningar med motiv från Provence', 'The-Starry-Night-Sv: 5th category')
  t.equal(doc.section('Motiv').depth(), 1, "The-Starry-Night-Sv: 'Motiv' is a depth-1 subsection")
  t.equal(
    doc.images()[0].caption(),
    'Cypresser i stjärnenatt, en teckning av van Gogh gjord i juni 1889 efter den då färdiga tavlan.',
    'The-Starry-Night-Sv: 1st image caption'
  )
  t.end()
})

test('Toronto-Sv', (t) => {
  const doc = wtf(readPage('Toronto-Sv'))
  t.match(doc.text(), /Toronto/, 'Toronto-Sv: city name')
  t.ok(
    doc.links().some((link) => link.page() === 'Ontario'),
    'Toronto-Sv: province link'
  )
  t.ok(doc.section('historia'), 'Toronto-Sv: Swedish history heading')
  t.match(doc.text(), /CN Tower/, 'Toronto-Sv: city landmark')
  t.ok(doc.references().length > 0, 'Toronto-Sv: city sources')
  t.ok(
    doc.infoboxes().some((box) => box.get('category').text() === 'Stad'),
    'Toronto-Sv: category field'
  )
  t.ok(doc.categories().includes('Orter i Ontario'), 'Toronto-Sv: Orter i Ontario category')
  t.equal(doc.sentences()[7].links()[0].page(), 'Europa', "Toronto-Sv: 8th sentence links to 'Europa'")
  t.equal(
    doc.section('Geografi och klimat').sentences()[1].links()[1].text(),
    'Don River',
    "Toronto-Sv: 'Geografi och klimat' section, 2nd sentence shows 'Don River' for Don River (vattendrag i Kanada)"
  )
  t.equal(
    doc.section('Demografi').sentences()[8].text(),
    'År 1900 kom Torontos invånare främst från Storbritannien och Irland.',
    "Toronto-Sv: 'Demografi' section, 9th sentence text"
  )
  t.equal(doc.sections()[3].title(), 'Ekonomi och kommunikationer', 'Toronto-Sv: section [3] title')
  t.equal(doc.infobox().get('elevation').text(), '76', 'Toronto-Sv: infobox elevation')
  t.equal(doc.sentences()[2].links()[0].page(), 'Nordamerika', "Toronto-Sv: 3rd sentence links to 'Nordamerika'")
  t.equal(
    doc.tables()[0].rows()[4]['delstat/provins'],
    'Texas, USA',
    "Toronto-Sv: table 1, row 5, 'delstat/provins' column"
  )
  t.ok(
    doc.section('Demografi').sentences()[1].text().startsWith('År 2004, rankade UNDP Toronto som nummer'),
    "Toronto-Sv: 'Demografi' section, 2nd sentence starts 'År 2004, rankade UNDP Toronto…'"
  )
  t.equal(
    doc.lists()[0].lines()[4].text(),
    'CFL-laget Toronto Argonauts (Kanadensisk fotboll)',
    'Toronto-Sv: list 1, item 5'
  )
  t.equal(doc.images()[2].file(), 'File:Toronto_Financial_District_August_2017.jpg', 'Toronto-Sv: 3rd image file')
  t.equal(doc.categories()[3], 'Folkräkningsområden i Ontario', 'Toronto-Sv: 4th category')
  t.end()
})
