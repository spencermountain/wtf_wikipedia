import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Ar', (t) => {
  const doc = wtf(readPage('Radiohead-Ar'))
  t.match(doc.text(), /راديوهيد/, 'band name')
  t.match(doc.text(), /OK Computer/, 'landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'توم يورك'),
    'lead singer link'
  )
  t.ok(doc.section('مراجع'), 'biography or references section')
  t.ok(doc.references().length > 0, 'sources for the band history')
  t.end()
})

test('Willow-Ar', (t) => {
  const doc = wtf(readPage('Willow-Ar'))
  t.match(doc.text(), /Salix/, 'Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'صفصافية'),
    'botanical link'
  )
  t.ok(doc.section('الأوراق'), 'botanical section')
  t.ok(doc.images().length > 0, 'willow illustrations')
  t.ok(doc.categories().length > 0, 'botanical categories')
  t.end()
})

test('Wimbledon-Championships-Ar', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Ar'))
  t.ok(doc.categories().includes('أحداث رياضية دورية أسست في 1877'), 'founded in 1877 category')
  t.ok(
    doc.links().some((link) => link.page() === 'كرة المضرب'),
    'tennis or venue link'
  )
  t.ok(doc.section('برامج البطولة'), 'tournament history or programme section')
  t.ok(doc.tables().length > 0, 'tournament records tables')
  t.ok(doc.references().length > 0, 'tournament sources')
  t.end()
})
