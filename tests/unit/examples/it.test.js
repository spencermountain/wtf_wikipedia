import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-It', (t) => {
  const doc = wtf(readPage('Radiohead-It'))
  t.match(doc.text(), /Radiohead/, 'band name')
  t.match(doc.text(), /OK Computer/, 'landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Thom Yorke'),
    'lead singer link'
  )
  t.ok(doc.section('Storia'), 'biography or references section')
  t.ok(doc.references().length > 0, 'sources for the band history')
  t.end()
})

test('Willow-It', (t) => {
  const doc = wtf(readPage('Willow-It'))
  t.match(doc.text(), /Salix/, 'Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salicaceae'),
    'botanical link'
  )
  t.ok(doc.section('Etimologia'), 'botanical section')
  t.ok(doc.images().length > 0, 'willow illustrations')
  t.ok(doc.categories().length > 0, 'botanical categories')
  t.end()
})

test('Wimbledon-Championships-It', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-It'))
  t.match(doc.text(), /1877/, 'first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'All England Lawn Tennis and Croquet Club'),
    'tennis or venue link'
  )
  t.ok(doc.section('Storia'), 'tournament history or programme section')
  t.ok(doc.tables().length > 0, 'tournament records tables')
  t.ok(doc.references().length > 0, 'tournament sources')
  t.end()
})
