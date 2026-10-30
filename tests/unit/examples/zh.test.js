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
  t.equal(doc.sentences()[0].links()[1].page(), '油画', "Dogs-Playing-Poker-Zh: 1st sentence links to '油画'")
  t.equal(doc.references()[0].title(), 'Dogs Playing Poker', 'Dogs-Playing-Poker-Zh: 1st reference title')
  t.equal(doc.categories()[0], '饮食题材画作', 'Dogs-Playing-Poker-Zh: 1st category')
  t.equal(doc.images()[0].caption(), '玩扑克的狗，1894年', 'Dogs-Playing-Poker-Zh: 1st image caption')
  t.equal(doc.sections().length, 2, 'Dogs-Playing-Poker-Zh: 2 sections')
  t.equal(doc.links()[2].page(), '油画', "Dogs-Playing-Poker-Zh: link [2] is '油画'")
  t.ok(doc.templates('reflist').length > 0, 'Dogs-Playing-Poker-Zh: has a {{reflist}} template')
  t.equal(doc.links()[0].page(), 'Chicago', "Dogs-Playing-Poker-Zh: link [0] is 'Chicago'")
  t.equal(doc.categories()[6], '1910年畫作', 'Dogs-Playing-Poker-Zh: 7th category')
  t.equal(doc.categories()[9], '狗主角作品', 'Dogs-Playing-Poker-Zh: 10th category')
  t.equal(doc.categories()[5], '美国绘画作品', 'Dogs-Playing-Poker-Zh: 6th category')
  t.end()
})

test('Toronto-Zh', (t) => {
  const doc = wtf(readPage('Toronto-Zh'))
  const city = doc.infoboxes().find((box) => box.type() === 'city')
  t.equal(city.get('native_name').text(), 'Toronto', 'Toronto-Zh: native city name')
  t.ok(doc.links().some((link) => link.page() === '安大略省'), 'Toronto-Zh: province link')
  t.ok(doc.section('历史'), 'Toronto-Zh: Chinese history heading')
  t.ok(doc.images().some((image) => image.file() === 'File:Toronto_1894large.jpg'), 'Toronto-Zh: historical city illustration')
  t.ok(doc.references().length > 0, 'Toronto-Zh: city sources')
  t.ok(doc.section('地理'), 'Toronto-Zh: 地理 section')
  t.equal(city.get('nickname').text(), '會議之城', 'Toronto-Zh: city nickname')
  t.equal(
    doc.section('经济').sentences()[3].links()[0].page(),
    '加拿大統計局',
    "Toronto-Zh: '经济' section, 4th sentence links to '加拿大統計局'"
  )
  t.equal(doc.sentences()[7].links()[0].text(), '国际性', "Toronto-Zh: 8th sentence shows '国际性' for 世界主义")
  t.equal(
    doc.section('教育').sentences()[0].text(),
    '多倫多市內的公立中小學以主要授課語言和宗教背景分為四個類別，並由數間不同機構營運：',
    "Toronto-Zh: '教育' section, 1st sentence text"
  )
  t.equal(doc.sections()[18].title(), '体育', 'Toronto-Zh: section [18] title')
  t.equal(doc.infoboxes()[1].get('utc_offset').text(), '-5', 'Toronto-Zh: infobox utc_offset')
  t.equal(
    doc.section('高速公路').sentences()[0].links()[2].page(),
    '安大略401號省道',
    "Toronto-Zh: '高速公路' section, 1st sentence links to '安大略401號省道'"
  )
  t.equal(doc.references()[1].title(), '《唐人街拾零》别有風情', 'Toronto-Zh: 2nd reference title')
  t.equal(doc.lists()[3].lines()[8].text(), '百年理工學院', 'Toronto-Zh: list 4, item 9')
  t.equal(doc.sentences()[0].bolds()[0].text, '多伦多', "Toronto-Zh: 1st sentence bolds '多伦多'")
  t.equal(doc.images()[0].file(), 'File:Toronto,_City_of.svg', 'Toronto-Zh: 1st image file')
  t.equal(doc.categories()[1], '安大略省城市', 'Toronto-Zh: 2nd category')
  t.end()
})
