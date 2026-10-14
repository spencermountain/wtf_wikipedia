import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Dogs-Playing-Poker-Zh', (t) => {
  const doc = wtf(readPage('Dogs-Playing-Poker-Zh'))
  t.match(doc.text(), /玩扑克的狗/, 'Chinese series title')
  t.ok(doc.links().some((link) => link.page() === '卡修斯·马塞勒斯·库利奇'), 'artist link')
  t.equal(doc.references().length, 2, 'two sources for the series')
  t.ok(
    doc.images().some((image) => image.file() === 'File:Cassius_Marcellus_Coolidge_-_Poker_Game_(1894).png'),
    '1894 painting illustration'
  )
  t.ok(doc.categories().includes('系列畫作'), 'painting series category')
  t.end()
})

test('Toronto-Zh', (t) => {
  const doc = wtf(readPage('Toronto-Zh'))
  const city = doc.infoboxes().find((box) => box.type() === 'city')
  t.equal(city.get('native_name').text(), 'Toronto', 'native city name')
  t.ok(doc.links().some((link) => link.page() === '安大略省'), 'province link')
  t.ok(doc.section('历史'), 'Chinese history heading')
  t.ok(doc.images().some((image) => image.file() === 'File:Toronto_1894large.jpg'), 'historical city illustration')
  t.ok(doc.references().length > 0, 'city sources')
  t.end()
})
