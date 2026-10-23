import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Fr', (t) => {
  const doc = wtf(readPage('Radiohead-Fr'))
  t.match(doc.text(), /Radiohead/, 'Radiohead-Fr: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-Fr: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Thom Yorke'),
    'Radiohead-Fr: lead singer link'
  )
  t.ok(doc.section('biographie'), 'Radiohead-Fr: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-Fr: sources for the band history')
  t.match(doc.text(), /In Rainbows/, 'Radiohead-Fr: self-released album')
  t.ok(doc.section('formation et début (1986–1991)'), 'Radiohead-Fr: Formation et début (1986–1991) section')
  t.end()
})

test('Willow-Fr', (t) => {
  const doc = wtf(readPage('Willow-Fr'))
  t.match(doc.text(), /Salix/, 'Willow-Fr: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Salicaceae'),
    'Willow-Fr: botanical link'
  )
  t.ok(doc.section('étymologie'), 'Willow-Fr: botanical section')
  t.ok(doc.images().length > 0, 'Willow-Fr: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow-Fr: botanical categories')
  t.ok(doc.section('caractères généraux'), 'Willow-Fr: Caractères généraux section')
  t.ok(doc.section('principales espèces'), 'Willow-Fr: principal willow species section')
  t.end()
})

test('Wimbledon-Championships-Fr', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Fr'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships-Fr: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'All England Lawn Tennis and Croquet Club'),
    'Wimbledon-Championships-Fr: tennis or venue link'
  )
  t.ok(doc.section('historique'), 'Wimbledon-Championships-Fr: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-Fr: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-Fr: tournament sources')
  t.ok(doc.infoboxes().some((box) => box.get('directeur').text() === 'Sally Bolton'), 'Wimbledon-Championships-Fr: tournament director in snapshot')
  t.ok(doc.categories().includes('Tournoi de Wimbledon'), 'Wimbledon-Championships-Fr: Tournoi de Wimbledon category')
  t.end()
})
