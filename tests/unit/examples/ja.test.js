import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Ja', (t) => {
  const doc = wtf(readPage('Radiohead-Ja'))
  t.match(doc.text(), /レディオヘッド/, 'Radiohead-Ja: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-Ja: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'トム・ヨーク'),
    'Radiohead-Ja: lead singer link'
  )
  t.ok(doc.section('来歴'), 'Radiohead-Ja: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-Ja: sources for the band history')
  t.match(doc.text(), /Kid A/, 'Radiohead-Ja: experimental album')
  t.ok(doc.categories().includes('イングランドのオルタナティヴ・ロック・バンド'), 'Radiohead-Ja: イングランドのオルタナティヴ・ロック・バンド category')
  t.end()
})

test('Willow-Ja', (t) => {
  const doc = wtf(readPage('Willow-Ja'))
  t.match(doc.text(), /Salix/, 'Willow-Ja: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'ヤナギ科'),
    'Willow-Ja: botanical link'
  )
  t.ok(doc.section('特徴'), 'Willow-Ja: botanical section')
  t.match(doc.text(), /シダレヤナギ/, 'Willow-Ja: weeping willow species')
  t.ok(doc.categories().length > 0, 'Willow-Ja: botanical categories')
  t.match(doc.text(), /風見草/, 'Willow-Ja: alternative Japanese common name')
  t.ok(doc.links().some((link) => link.page() === '北半球'), 'Willow-Ja: northern hemisphere distribution')
  t.end()
})

test('Wimbledon-Championships-Ja', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Ja'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships-Ja: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'テニス'),
    'Wimbledon-Championships-Ja: tennis or venue link'
  )
  t.ok(doc.section('歴史'), 'Wimbledon-Championships-Ja: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-Ja: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-Ja: tournament sources')
  t.ok(doc.links().some((link) => link.page() === 'イギリス'), 'Wimbledon-Championships-Ja: イギリス link')
  t.ok(doc.section('概要'), 'Wimbledon-Championships-Ja: 概要 section')
  t.end()
})
