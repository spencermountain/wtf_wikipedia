import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-It', (t) => {
  const doc = wtf(readPage('Radiohead-It'))
  t.match(doc.text(), /Radiohead/, 'Radiohead-It: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-It: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Thom Yorke'),
    'Radiohead-It: lead singer link'
  )
  t.ok(doc.section('Storia'), 'Radiohead-It: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-It: sources for the band history')
  t.ok(doc.categories().includes('Vincitori di Grammy'), 'Radiohead-It: Vincitori di Grammy category')
  t.ok(doc.links().some((link) => link.page() === 'gruppo musicale'), 'Radiohead-It: gruppo musicale link')
  t.end()
})

test('Willow-It', (t) => {
  const doc = wtf(readPage('Willow-It'))
  t.match(doc.text(), /Salix/, 'Willow-It: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salicaceae'),
    'Willow-It: botanical link'
  )
  t.ok(doc.section('Etimologia'), 'Willow-It: botanical section')
  t.ok(doc.images().length > 0, 'Willow-It: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow-It: botanical categories')
  t.ok(doc.links().some((link) => link.page() === 'Linneo'), 'Willow-It: Linneo link')
  t.ok(doc.section('Tassonomia'), 'Willow-It: Tassonomia section')
  t.end()
})

test('Wimbledon-Championships-It', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-It'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships-It: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'All England Lawn Tennis and Croquet Club'),
    'Wimbledon-Championships-It: tennis or venue link'
  )
  t.ok(doc.section('Storia'), 'Wimbledon-Championships-It: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-It: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-It: tournament sources')
  t.ok(doc.section('Dalle origini alla prima guerra mondiale'), 'Wimbledon-Championships-It: Dalle origini alla prima guerra mondiale section')
  t.match(doc.text(), /Roger Federer/, 'Wimbledon-Championships-It: singles champion')
  t.end()
})
