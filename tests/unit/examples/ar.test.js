import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Ar', (t) => {
  const doc = wtf(readPage('Radiohead-Ar'))
  t.match(doc.text(), /راديوهيد/, 'Radiohead-Ar: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-Ar: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'توم يورك'),
    'Radiohead-Ar: lead singer link'
  )
  t.ok(doc.section('مراجع'), 'Radiohead-Ar: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-Ar: sources for the band history')
  t.ok(doc.categories().includes('تأسيسات سنة 1985 في المملكة المتحدة'), 'Radiohead-Ar: تأسيسات سنة 1985 في المملكة المتحدة category')
  t.ok(doc.links().some((link) => link.page() === 'موسيقى الروك'), 'Radiohead-Ar: موسيقى الروك link')
  t.end()
})

test('Willow-Ar', (t) => {
  const doc = wtf(readPage('Willow-Ar'))
  t.match(doc.text(), /Salix/, 'Willow-Ar: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'صفصافية'),
    'Willow-Ar: botanical link'
  )
  t.ok(doc.section('الأوراق'), 'Willow-Ar: botanical section')
  t.ok(doc.images().length > 0, 'Willow-Ar: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow-Ar: botanical categories')
  t.ok(doc.links().some((link) => link.page() === 'جنس (تصنيف)'), 'Willow-Ar: جنس (تصنيف) link')
  t.ok(doc.section('التفتح وتساقط الأوراق'), 'Willow-Ar: التفتح وتساقط الأوراق section')
  t.end()
})

test('Wimbledon-Championships-Ar', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Ar'))
  t.ok(doc.categories().includes('أحداث رياضية دورية أسست في 1877'), 'Wimbledon-Championships-Ar: founded in 1877 category')
  t.ok(
    doc.links().some((link) => link.page() === 'كرة المضرب'),
    'Wimbledon-Championships-Ar: tennis or venue link'
  )
  t.ok(doc.section('برامج البطولة'), 'Wimbledon-Championships-Ar: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-Ar: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-Ar: tournament sources')
  t.ok(doc.section('الجوائز'), 'Wimbledon-Championships-Ar: الجوائز section')
  t.match(doc.text(), /يونيو/, 'Wimbledon-Championships-Ar: June tournament schedule')
  t.end()
})
