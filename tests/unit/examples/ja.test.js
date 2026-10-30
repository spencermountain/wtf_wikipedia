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
  t.equal(
    doc.sentences()[8].links()[0].page(),
    'オックスフォード',
    "Radiohead-Ja: 9th sentence links to 'オックスフォード'"
  )
  t.equal(
    doc.sentences()[16].links()[0].text(),
    'アコースティック',
    "Radiohead-Ja: 17th sentence shows 'アコースティック' for アンプラグド"
  )
  t.equal(doc.sections()[18].title(), '注釈', 'Radiohead-Ja: section [18] title')
  t.equal(doc.infoboxes()[1].get('years_active').text(), '2005年 -', 'Radiohead-Ja: infobox years_active')
  t.equal(
    doc.section('音楽的な影響').sentences()[7].links()[0].page(),
    'クレジットタイトル',
    "Radiohead-Ja: '音楽的な影響' section, 8th sentence links to 'クレジットタイトル'"
  )
  t.equal(
    doc.references()[18].title(),
    'ロキシー、ゾンビーズ、ジャネット、ロックの殿堂入りに喜びのコメント',
    'Radiohead-Ja: 19th reference title'
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'Slowly Downward 公式サイト', 'Radiohead-Ja: list 1, item 1')
  t.equal(
    doc.section('来歴').sentences()[1].bolds()[0].text,
    'オン・ア・フライデー',
    "Radiohead-Ja: '来歴' section, 2nd sentence bolds 'オン・ア・フライデー'"
  )
  t.equal(doc.images()[0].file(), 'File:Radiohead.jpg', 'Radiohead-Ja: 1st image file')
  t.equal(doc.categories()[3], 'エレクトロニック・ミュージシャン', 'Radiohead-Ja: 4th category')
  t.equal(doc.section('日本との関係').depth(), 1, "Radiohead-Ja: '日本との関係' is a depth-1 subsection")
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
  t.equal(
    doc.section('薬用').sentences()[9].links()[0].page(),
    'ビタミンC',
    "Willow-Ja: '薬用' section, 10th sentence links to 'ビタミンC'"
  )
  t.equal(
    doc.section('薬用').sentences()[0].links()[0].text(),
    '解熱鎮痛薬',
    "Willow-Ja: '薬用' section, 1st sentence shows '解熱鎮痛薬' for 非ステロイド性抗炎症薬"
  )
  t.equal(doc.sections()[9].title(), '薬用', 'Willow-Ja: section [9] title')
  t.equal(doc.infobox().get('和名').text(), 'ヤナギ属', 'Willow-Ja: infobox 和名')
  t.equal(
    doc.sentences()[29].links()[0].page(),
    'セイヨウシロヤナギ',
    "Willow-Ja: 30th sentence links to 'セイヨウシロヤナギ'"
  )
  t.equal(doc.references()[34].title(), '世界の樹木をめぐる80の物語', 'Willow-Ja: 35th reference title')
  t.equal(
    doc.lists()[5].lines()[0].text(),
    'セイヨウシロヤナギ／柳、川柳 - 聖書植物園 Biblical Botanical Garden 西南学院大学',
    'Willow-Ja: list 6, item 1'
  )
  t.equal(doc.images()[0].file(), 'File:Yanagi.jpg', 'Willow-Ja: 1st image file')
  t.equal(doc.categories()[0], 'ヤナギ属', 'Willow-Ja: 1st category')
  t.equal(doc.section('日本人とヤナギ').depth(), 1, "Willow-Ja: '日本人とヤナギ' is a depth-1 subsection")
  t.equal(doc.sections().length, 16, 'Willow-Ja: 16 sections')
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
  t.equal(
    doc.section('日本人出場選手').sentences()[5].links()[0].page(),
    '沢松和子',
    "Wimbledon-Championships-Ja: '日本人出場選手' section, 6th sentence links to '沢松和子'"
  )
  t.equal(
    doc.sentences()[19].links()[0].text(),
    '第1回大会',
    "Wimbledon-Championships-Ja: 20th sentence shows '第1回大会' for 1877年ウィンブルドン選手権"
  )
  t.equal(
    doc.section('テレビ放送').sentences()[2].text(),
    '2024年現在、日本ではWOWOWが衛星放送権を、NHKが地上波放送権を持つ',
    "Wimbledon-Championships-Ja: 'テレビ放送' section, 3rd sentence text"
  )
  t.equal(doc.sections()[11].title(), '日本人出場選手', 'Wimbledon-Championships-Ja: section [11] title')
  t.equal(
    doc.section('トロフィー').sentences()[7].links()[0].page(),
    'オックスフォード大学',
    "Wimbledon-Championships-Ja: 'トロフィー' section, 8th sentence links to 'オックスフォード大学'"
  )
  t.equal(doc.tables()[1].rows()[7]['時代'], '1968年以前', "Wimbledon-Championships-Ja: table 2, row 8, '時代' column")
  t.equal(
    doc.references()[26].title(),
    'テニスのウィンブルドン大会、今年はロシアとベラルーシの選手出場認める',
    'Wimbledon-Championships-Ja: 27th reference title'
  )
  t.equal(
    doc.lists()[0].lines()[3].text(),
    'ウィンブルドン選手権女子ダブルス優勝者一覧',
    'Wimbledon-Championships-Ja: list 1, item 4'
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'ウィンブルドン選手権',
    "Wimbledon-Championships-Ja: 1st sentence bolds 'ウィンブルドン選手権'"
  )
  t.equal(doc.images()[6].file(), 'File:Ryuki_Miki_1929.jpg', 'Wimbledon-Championships-Ja: 7th image file')
  t.equal(doc.categories()[0], 'ウィンブルドン選手権', 'Wimbledon-Championships-Ja: 1st category')
  t.end()
})
