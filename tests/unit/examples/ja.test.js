import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Ja', (t) => {
  const doc = wtf(readPage('Radiohead-Ja'))
  t.match(doc.text(), /レディオヘッド/, 'band name')
  t.match(doc.text(), /OK Computer/, 'landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'トム・ヨーク'),
    'lead singer link'
  )
  t.ok(doc.section('来歴'), 'biography or references section')
  t.ok(doc.references().length > 0, 'sources for the band history')
  t.end()
})

test('Willow-Ja', (t) => {
  const doc = wtf(readPage('Willow-Ja'))
  t.match(doc.text(), /Salix/, 'Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'ヤナギ科'),
    'botanical link'
  )
  t.ok(doc.section('特徴'), 'botanical section')
  t.match(doc.text(), /シダレヤナギ/, 'weeping willow species')
  t.ok(doc.categories().length > 0, 'botanical categories')
  t.end()
})

test('Wimbledon-Championships-Ja', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Ja'))
  t.match(doc.text(), /1877/, 'first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'テニス'),
    'tennis or venue link'
  )
  t.ok(doc.section('歴史'), 'tournament history or programme section')
  t.ok(doc.tables().length > 0, 'tournament records tables')
  t.ok(doc.references().length > 0, 'tournament sources')
  t.end()
})
