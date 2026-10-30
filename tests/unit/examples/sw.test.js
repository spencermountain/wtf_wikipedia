import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Taarab-Sw', (t) => {
  const doc = wtf(readPage('Taarab-Sw'))
  t.match(doc.text(), /Waswahili/, 'Taarab-Sw: Swahili cultural origins')
  t.ok(
    doc.links().some((link) => link.page() === 'Zanzibar'),
    'Taarab-Sw: Zanzibar music history link'
  )
  t.ok(doc.section('historia'), 'Taarab-Sw: history section')
  t.ok(doc.categories().includes('Muziki wa Tanzania'), 'Taarab-Sw: Tanzanian music category')
  t.ok(doc.references().length > 0, 'Taarab-Sw: music history sources')
  t.ok(doc.categories().includes('Muziki wa Kenya'), 'Taarab-Sw: Muziki wa Kenya category')
  t.ok(
    doc.links().some((link) => link.page() === 'Muziki'),
    'Taarab-Sw: muziki link'
  )
  t.equal(doc.sentences()[4].links()[1].page(), 'Kinanda', "Taarab-Sw: 5th sentence links to 'Kinanda'")
  t.equal(
    doc.section('Tabia za taarab').sentences()[2].links()[1].text(),
    'vinanda',
    "Taarab-Sw: 'Tabia za taarab' section, 3rd sentence shows 'vinanda' for Kinanda"
  )
  t.equal(
    doc.sentences()[8].text(),
    'Mohammed aliporudi alikuwa mwanashairi wa Sultani akaendelea kuwafundisha marafiki vinanda vyake.',
    'Taarab-Sw: 9th sentence text'
  )
  t.equal(doc.sections()[1].title(), 'Tabia za taarab', 'Taarab-Sw: section [1] title')
  t.equal(doc.sentences()[14].links()[0].page(), 'Dini', "Taarab-Sw: 15th sentence links to 'Dini'")
  t.ok(
    doc.sentences()[15].text().startsWith('Miaka ya nyuma muziki wa taarab umesambaa'),
    "Taarab-Sw: 16th sentence starts 'Miaka ya nyuma muziki wa taara…'"
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'Mifano ya muziki ya taarabu (audio)', 'Taarab-Sw: list 1, item 1')
  t.equal(doc.images()[1].file(), 'File:Waziri_Ally.JPG', 'Taarab-Sw: 2nd image file')
  t.equal(doc.images()[1].caption(), 'Waziri Ally akipiga kinanda Lucky Star.', 'Taarab-Sw: 2nd image caption')
  t.equal(doc.sections().length, 8, 'Taarab-Sw: 8 sections')
  t.equal(doc.sentences()[0].links()[2].page(), 'Asili', "Taarab-Sw: 1st sentence links to 'Asili'")
  t.end()
})

test('Tennis-Sw', (t) => {
  const doc = wtf(readPage('Tennis-Sw'))
  t.match(doc.text(), /tenisi/, 'Tennis-Sw: Swahili sport name')
  t.ok(
    doc.links().some((link) => link.page() === 'Wimbledon'),
    'Tennis-Sw: Wimbledon tournament link'
  )
  t.match(doc.section('uwanja wa tennis').text(), /23\.77/, 'Tennis-Sw: court length in metres')
  t.equal(doc.section('kanuni').lists()[0].lines().length, 5, 'Tennis-Sw: five playing rules')
  t.ok(
    doc.images().some((image) => image.file().endsWith(':Tennisball.jpg')),
    'Tennis-Sw: tennis ball gallery photograph'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Michezo'),
    'Tennis-Sw: michezo link'
  )
  t.ok(doc.section('historia ya michezo'), 'Tennis-Sw: Historia ya michezo section')
  t.equal(
    doc.section('Historia ya michezo').sentences()[4].links()[1].page(),
    'Neno',
    "Tennis-Sw: 'Historia ya michezo' section, 5th sentence links to 'Neno'"
  )
  t.equal(doc.sentences()[5].links()[2].text(), 'makofi', "Tennis-Sw: 6th sentence shows 'makofi' for Kofi")
  t.equal(
    doc.sentences()[14].text(),
    'Katika nchi mbalimbali hadi leo ina sifa ya kuwa mchezo wa matajiri lakini katika nchi nyingine inachezwa na watu wa matabaka yote.',
    'Tennis-Sw: 15th sentence text'
  )
  t.equal(doc.sections()[5].title(), 'Picha', 'Tennis-Sw: section [5] title')
  t.equal(doc.sentences()[8].links()[2].page(), 'Kifaransa', "Tennis-Sw: 9th sentence links to 'Kifaransa'")
  t.ok(
    doc.sentences()[0].text().startsWith('Tennis (pia tenisi) ni aina ya michezo'),
    "Tennis-Sw: 1st sentence starts 'Tennis (pia tenisi) ni aina ya…'"
  )
  t.equal(
    doc.lists()[2].lines()[1].text(),
    "WTA The official site for women's professional tennis",
    'Tennis-Sw: list 3, item 2'
  )
  t.equal(doc.images()[3].file(), 'Image:Tennisball.jpg', 'Tennis-Sw: 4th image file')
  t.equal(doc.images()[2].caption(), 'Refa kwenye kiti cha juu.', 'Tennis-Sw: 3rd image caption')
  t.equal(doc.sections().length, 8, 'Tennis-Sw: 8 sections')
  t.equal(doc.sentences()[13].links()[1].page(), '1924', "Tennis-Sw: 14th sentence links to '1924'")
  t.end()
})

test('Willow-Sw', (t) => {
  const doc = wtf(readPage('Willow-Sw'))
  t.match(doc.text(), /Salix/, 'Willow-Sw: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salix babylonica'),
    'Willow-Sw: botanical link'
  )
  t.ok(doc.section('spishi'), 'Willow-Sw: botanical section')
  t.match(doc.text(), /Misafsafi/, 'Willow-Sw: Swahili common name')
  t.ok(doc.section('spishi').lists().length > 0, 'Willow-Sw: species list')
  t.ok(
    doc.links().some((link) => link.page() === 'Uchina'),
    'Willow-Sw: weeping willow origin in China'
  )
  t.ok(doc.categories().includes('Mwenda-usiku na jamaa'), 'Willow-Sw: Mwenda-usiku na jamaa category')
  t.equal(doc.sentences()[0].links()[2].page(), 'Miti', "Willow-Sw: 1st sentence links to 'Miti'")
  t.equal(
    doc.sentences()[1].text(),
    'Misafsafi inayojulikana sana ni Msafsafi wa Babeli (Salix babylonica) kutoka Uchina na Msafsafi Mweupe (Salix alba) kutoka Ulaya.',
    'Willow-Sw: 2nd sentence text'
  )
  t.equal(doc.sections()[1].title(), 'Spishi', 'Willow-Sw: section [1] title')
  t.equal(doc.sentences()[1].links()[2].page(), 'Salix alba', "Willow-Sw: 2nd sentence links to 'Salix alba'")
  t.equal(doc.lists()[0].lines()[1].text(), 'Salix alba, Msafsafi Mweupe (White Willow)', 'Willow-Sw: list 1, item 2')
  t.equal(doc.sentences()[0].bolds()[0].text, 'صفصاف', "Willow-Sw: 1st sentence bolds 'صفصاف'")
  t.equal(doc.categories()[1], 'Miti', 'Willow-Sw: 2nd category')
  t.equal(doc.sections().length, 2, 'Willow-Sw: 2 sections')
  t.equal(doc.sentences()[0].links()[0].page(), 'Kiarabu', "Willow-Sw: 1st sentence links to 'Kiarabu'")
  t.equal(doc.links()[33].page(), 'Msafsafi wa Babeli', "Willow-Sw: link [33] is 'Msafsafi wa Babeli'")
  t.ok(doc.templates('mbegu-mmea').length > 0, 'Willow-Sw: has a {{mbegu-mmea}} template')
  t.end()
})
