import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Taarab-Sw', (t) => {
  const doc = wtf(readPage('Taarab-Sw'))
  t.match(doc.text(), /Waswahili/, 'Swahili cultural origins')
  t.ok(
    doc.links().some((link) => link.page() === 'Zanzibar'),
    'Zanzibar music history link'
  )
  t.ok(doc.section('Historia'), 'history section')
  t.ok(doc.categories().includes('Muziki wa Tanzania'), 'Tanzanian music category')
  t.ok(doc.references().length > 0, 'music history sources')
  t.end()
})

test('Tennis-Sw', (t) => {
  const doc = wtf(readPage('Tennis-Sw'))
  t.match(doc.text(), /tenisi/, 'Swahili sport name')
  t.ok(
    doc.links().some((link) => link.page() === 'Wimbledon'),
    'Wimbledon tournament link'
  )
  t.match(doc.section('Uwanja wa tennis').text(), /23\.77/, 'court length in metres')
  t.equal(doc.section('Kanuni').list().lines().length, 5, 'five playing rules')
  t.ok(
    doc.images().some((image) => image.file().endsWith(':Tennisball.jpg')),
    'tennis ball gallery photograph'
  )
  t.end()
})

test('Willow-Sw', (t) => {
  const doc = wtf(readPage('Willow-Sw'))
  t.match(doc.text(), /Salix/, 'Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salix babylonica'),
    'botanical link'
  )
  t.ok(doc.section('Spishi'), 'botanical section')
  t.match(doc.text(), /Misafsafi/, 'Swahili common name')
  t.ok(doc.section('Spishi').lists().length > 0, 'species list')
  t.end()
})
