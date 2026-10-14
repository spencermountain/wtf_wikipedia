import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Ru', (t) => {
  const doc = wtf(readPage('Radiohead-Ru'))
  t.match(doc.text(), /Radiohead/, 'Radiohead-Ru: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-Ru: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Йорк, Том'),
    'Radiohead-Ru: lead singer link'
  )
  t.ok(doc.section('История'), 'Radiohead-Ru: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-Ru: sources for the band history')
  t.match(doc.text(), /Kid A/, 'Radiohead-Ru: experimental album')
  t.ok(doc.categories().includes('Группы альтернативного рока Великобритании'), 'Radiohead-Ru: Группы альтернативного рока Великобритании category')
  t.end()
})

test('Willow-Ru', (t) => {
  const doc = wtf(readPage('Willow-Ru'))
  t.match(doc.text(), /Salix/, 'Willow-Ru: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Древесные растения'),
    'Willow-Ru: botanical link'
  )
  t.ok(doc.section('Ботаническое описание'), 'Willow-Ru: botanical section')
  t.ok(doc.images().length > 0, 'Willow-Ru: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow-Ru: botanical categories')
  t.ok(doc.categories().includes('Ива'), 'Willow-Ru: Ива category')
  t.ok(doc.links().some((link) => link.page() === 'род (биология)'), 'Willow-Ru: род (биология) link')
  t.end()
})

test('Wimbledon-Championships-Ru', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Ru'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships-Ru: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'Всеанглийский клуб лаун-тенниса и крокета'),
    'Wimbledon-Championships-Ru: tennis or venue link'
  )
  t.ok(doc.section('История'), 'Wimbledon-Championships-Ru: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-Ru: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-Ru: tournament sources')
  t.ok(doc.links().some((link) => link.page() === 'Турниры Большого шлема (теннис)'), 'Wimbledon-Championships-Ru: Турниры Большого шлема (теннис) link')
  t.ok(doc.section('Предшествующие события'), 'Wimbledon-Championships-Ru: Предшествующие события section')
  t.end()
})
