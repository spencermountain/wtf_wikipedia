import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('The-Starry-Night-Vi', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Vi'))
  t.equal(doc.infobox().get('title').text(), 'Đêm đầy sao', 'The-Starry-Night-Vi: Vietnamese painting title')
  t.equal(doc.infobox().get('year').text(), '1889', 'The-Starry-Night-Vi: year of creation')
  t.ok(
    doc.links().some((link) => link.page() === 'Museum of Modern Art'),
    'The-Starry-Night-Vi: museum collection link'
  )
  t.ok(doc.section('nguồn gốc'), 'The-Starry-Night-Vi: origins section')
  t.ok(doc.references().length > 0, 'The-Starry-Night-Vi: painting history sources')
  t.ok(
    doc.infoboxes().some((box) => box.get('accession').text() === '472,1941'),
    'The-Starry-Night-Vi: accession field'
  )
  t.ok(
    doc.links().some((link) => link.page() === 'Hậu ấn tượng'),
    'The-Starry-Night-Vi: hậu ấn tượng link'
  )
  t.equal(doc.sentences()[5].links()[0].page(), 'Arles', "The-Starry-Night-Vi: 6th sentence links to 'Arles'")
  t.equal(
    doc.sentences()[0].links()[2].text(),
    'Vincent van Gogh',
    "The-Starry-Night-Vi: 1st sentence shows 'Vincent van Gogh' for Vincent Van Gogh"
  )
  t.equal(
    doc.sentences()[16].text(),
    'Cây Hoàng đàn ở bên trái đã được thêm vào bố cục của bức tranh.',
    'The-Starry-Night-Vi: 17th sentence text'
  )
  t.equal(doc.sections()[1].title(), 'Nguồn gốc', 'The-Starry-Night-Vi: section [1] title')
  t.equal(doc.infobox().get('city').text(), 'Thành phố New York', 'The-Starry-Night-Vi: infobox city')
  t.equal(
    doc.sentences()[5].links()[1].page(),
    'Đêm đầy sao trên sông Rhone',
    "The-Starry-Night-Vi: 6th sentence links to 'Đêm đầy sao trên sông Rhone'"
  )
  t.equal(
    doc.references()[9].title(),
    'Van Gogh: Sternennacht: Kunstgeschichte im Detail',
    'The-Starry-Night-Vi: 10th reference title'
  )
  t.ok(
    doc.section('Nguồn gốc').sentences()[1].text().startsWith('Tháng 9 năm 1888, trước khi bị'),
    "The-Starry-Night-Vi: 'Nguồn gốc' section, 3rd sentence starts 'Tháng 9 năm 1888, trước khi bị'"
  )
  t.equal(
    doc.lists()[1].lines()[1].text(),
    'smARThistory: Đêm đầy sao của van Gogh Archived 2007-07-09 at the Wayback Machine',
    'The-Starry-Night-Vi: list 2, item 2'
  )
  t.equal(
    doc.images()[0].file(),
    'File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    'The-Starry-Night-Vi: 1st image file'
  )
  t.equal(doc.categories()[0], 'Tranh vẽ của Vincent van Gogh', 'The-Starry-Night-Vi: 1st category')
  t.end()
})

test('Toronto-Vi', (t) => {
  const doc = wtf(readPage('Toronto-Vi'))
  t.equal(doc.infobox().get('official_name').text(), 'City of Toronto', 'Toronto-Vi: official city name')
  t.ok(
    doc.links().some((link) => link.page() === 'Ontario'),
    'Toronto-Vi: province link'
  )
  t.ok(doc.section('lịch sử'), 'Toronto-Vi: Vietnamese history heading')
  t.ok(doc.tables().length > 0, 'Toronto-Vi: city data table')
  t.ok(doc.references().length > 0, 'Toronto-Vi: city sources')
  t.ok(
    doc.references().some((reference) => reference.wikitext().includes('American Heritage Dictionary')),
    'Toronto-Vi: pronunciation source'
  )
  t.ok(doc.section('tên gọi'), 'Toronto-Vi: Tên gọi section')
  t.equal(
    doc.section('Địa lý').sentences()[2].links()[1].page(),
    'Port Lands',
    "Toronto-Vi: 'Địa lý' section, 2nd sentence links to 'Port Lands'"
  )
  t.equal(
    doc.sentences()[26].links()[1].text(),
    'York',
    "Toronto-Vi: 27th sentence shows 'York' for York, Upper Canada"
  )
  t.equal(
    doc.section('Giao thông công cộng').sentences()[0].text(),
    'Hệ thống giao thông công cộng chính của Toronto được vận hành bởi Ủy ban Giao thông Toronto (TTC).',
    "Toronto-Vi: 'Giao thông công cộng' section, 1st sentence text"
  )
  t.equal(doc.sections()[18].title(), 'Thư mục', 'Toronto-Vi: section [18] title')
  t.equal(
    doc.sentences()[9].links()[0].page(),
    'Chiến tranh Hoa Kỳ - Anh Quốc (1812)',
    "Toronto-Vi: 10th sentence links to 'Chiến tranh Hoa Kỳ - Anh Quốc (1812)'"
  )
  t.equal(doc.tables()[0].rows()[8]['2006'], '13,605', "Toronto-Vi: table 1, row 9, '2006' column")
  t.equal(
    doc.references()[16].title(),
    'Population estimates, July 1, by census division, 2021 boundaries',
    'Toronto-Vi: 17th reference title'
  )
  t.ok(
    doc.sentences()[37].text().startsWith('Dòng dân nhập cư đáng kể đầu'),
    "Toronto-Vi: 39th sentence starts 'Dòng dân nhập cư đáng kể đầu'"
  )
  t.equal(doc.lists()[4].lines()[3].text(), 'Bảo tàng Hoàng gia Ontario', 'Toronto-Vi: list 5, item 4')
  t.equal(doc.images()[0].file(), 'File:Toronto_Flag.svg', 'Toronto-Vi: 1st image file')
  t.equal(doc.categories()[0], 'Khởi đầu năm 1834 ở Canada', 'Toronto-Vi: 1st category')
  t.end()
})
