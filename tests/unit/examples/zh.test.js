import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Dogs-Playing-Poker-Zh', (t) => {
  const doc = wtf(readPage('Dogs-Playing-Poker-Zh'))
  t.match(doc.text(), /玩扑克的狗/, 'Dogs-Playing-Poker-Zh: Chinese series title')
  t.ok(doc.links().some((link) => link.page() === '卡修斯·马塞勒斯·库利奇'), 'Dogs-Playing-Poker-Zh: artist link')
  t.equal(doc.references().length, 2, 'Dogs-Playing-Poker-Zh: two sources for the series')
  t.ok(
    doc.images().some((image) => image.file() === 'File:Cassius_Marcellus_Coolidge_-_Poker_Game_(1894).png'),
    'Dogs-Playing-Poker-Zh: 1894 painting illustration'
  )
  t.ok(doc.categories().includes('系列畫作'), 'Dogs-Playing-Poker-Zh: painting series category')
  t.ok(doc.references().some((reference) => reference.title() === 'Lucky Dog!'), 'Dogs-Playing-Poker-Zh: named art magazine source')
  t.ok(doc.section('参考文献'), 'Dogs-Playing-Poker-Zh: 参考文献 section')
  t.end()
})

test('Toronto-Zh', (t) => {
  const doc = wtf(readPage('Toronto-Zh'))
  const city = doc.infoboxes().find((box) => box.type() === 'city')
  t.equal(city.get('native_name').text, 'Toronto', 'Toronto-Zh: native city name')
  t.ok(doc.links().some((link) => link.page() === '安大略省'), 'Toronto-Zh: province link')
  t.ok(doc.section('历史'), 'Toronto-Zh: Chinese history heading')
  t.ok(doc.images().some((image) => image.file() === 'File:Toronto_1894large.jpg'), 'Toronto-Zh: historical city illustration')
  t.ok(doc.references().length > 0, 'Toronto-Zh: city sources')
  t.ok(doc.section('地理'), 'Toronto-Zh: 地理 section')
  t.equal(city.get('nickname').text, '會議之城', 'Toronto-Zh: city nickname')
  t.end()
})
