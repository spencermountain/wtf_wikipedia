import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Ru', (t) => {
  const doc = wtf(readPage('Radiohead-Ru'))
  t.match(doc.text(), /Radiohead/, 'band name')
  t.match(doc.text(), /OK Computer/, 'landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Йорк, Том'),
    'lead singer link'
  )
  t.ok(doc.section('История'), 'biography or references section')
  t.ok(doc.references().length > 0, 'sources for the band history')
  t.end()
})

test('Willow-Ru', (t) => {
  const doc = wtf(readPage('Willow-Ru'))
  t.match(doc.text(), /Salix/, 'Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Древесные растения'),
    'botanical link'
  )
  t.ok(doc.section('Ботаническое описание'), 'botanical section')
  t.ok(doc.images().length > 0, 'willow illustrations')
  t.ok(doc.categories().length > 0, 'botanical categories')
  t.end()
})

test('Wimbledon-Championships-Ru', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Ru'))
  t.match(doc.text(), /1877/, 'first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'Всеанглийский клуб лаун-тенниса и крокета'),
    'tennis or venue link'
  )
  t.ok(doc.section('История'), 'tournament history or programme section')
  t.ok(doc.tables().length > 0, 'tournament records tables')
  t.ok(doc.references().length > 0, 'tournament sources')
  t.end()
})
