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
  t.ok(doc.section('Historia'), 'Taarab-Sw: history section')
  t.ok(doc.categories().includes('Muziki wa Tanzania'), 'Taarab-Sw: Tanzanian music category')
  t.ok(doc.references().length > 0, 'Taarab-Sw: music history sources')
  t.ok(doc.categories().includes('Muziki wa Kenya'), 'Taarab-Sw: Muziki wa Kenya category')
  t.ok(doc.links().some((link) => link.page() === 'muziki'), 'Taarab-Sw: muziki link')
  t.end()
})

test('Tennis-Sw', (t) => {
  const doc = wtf(readPage('Tennis-Sw'))
  t.match(doc.text(), /tenisi/, 'Tennis-Sw: Swahili sport name')
  t.ok(
    doc.links().some((link) => link.page() === 'Wimbledon'),
    'Tennis-Sw: Wimbledon tournament link'
  )
  t.match(doc.section('Uwanja wa tennis').text(), /23\.77/, 'Tennis-Sw: court length in metres')
  t.equal(doc.section('Kanuni').lists()[0].lines().length, 5, 'Tennis-Sw: five playing rules')
  t.ok(
    doc.images().some((image) => image.file().endsWith(':Tennisball.jpg')),
    'Tennis-Sw: tennis ball gallery photograph'
  )
  t.ok(doc.links().some((link) => link.page() === 'michezo'), 'Tennis-Sw: michezo link')
  t.ok(doc.section('Historia ya michezo'), 'Tennis-Sw: Historia ya michezo section')
  t.end()
})

test('Willow-Sw', (t) => {
  const doc = wtf(readPage('Willow-Sw'))
  t.match(doc.text(), /Salix/, 'Willow-Sw: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salix babylonica'),
    'Willow-Sw: botanical link'
  )
  t.ok(doc.section('Spishi'), 'Willow-Sw: botanical section')
  t.match(doc.text(), /Misafsafi/, 'Willow-Sw: Swahili common name')
  t.ok(doc.section('Spishi').lists().length > 0, 'Willow-Sw: species list')
  t.ok(doc.links().some((link) => link.page() === 'Uchina'), 'Willow-Sw: weeping willow origin in China')
  t.ok(doc.categories().includes('Mwenda-usiku na jamaa'), 'Willow-Sw: Mwenda-usiku na jamaa category')
  t.end()
})
