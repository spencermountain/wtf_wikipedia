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
  t.equal(doc.sentences()[0].links()[2].page(), 'أكسفورد', "Radiohead-Ar: 1st sentence links to 'أكسفورد'")
  t.equal(doc.sentences()[12].links()[0].text(), 'إيمي', "Radiohead-Ar: 13th sentence shows 'إيمي' for إيمي (توضيح)")
  t.equal(
    doc.sentences()[4].text(),
    'الأغنية لم تنجح في البداية، لكنها اشتهرت في جميع أنحاء العالم ولعدة أشهر بعد صدور أول ألبوم سنة ٬1993 Pablo Honey (بابلو٬العسل).',
    'Radiohead-Ar: 5th sentence text'
  )
  t.equal(doc.sections()[2].title(), 'وصلات خارجية', 'Radiohead-Ar: section [2] title')
  t.equal(doc.sentences()[9].links()[0].page(), 'Kid A', "Radiohead-Ar: 10th sentence links to 'Kid A'")
  t.ok(
    doc.sentences()[11].text().startsWith('Hail to the Thief (تحية للص) سنة'),
    "Radiohead-Ar: 12th sentence starts 'Hail to the Thief (تحية للص) س…'"
  )
  t.equal(doc.lists()[0].lines()[0].text(), 'موقع راديوهيد الرسمي 30px', 'Radiohead-Ar: list 1, item 1')
  t.equal(doc.categories()[15], 'فرق موسيقية من أوكسفوردشاير', 'Radiohead-Ar: 16th category')
  t.equal(doc.sections().length, 3, 'Radiohead-Ar: 3 sections')
  t.equal(doc.sentences()[4].links()[0].page(), 'Pablo Honey', "Radiohead-Ar: 5th sentence links to 'Pablo Honey'")
  t.equal(doc.sentences()[3].links()[0].text(), 'كريب', "Radiohead-Ar: 4th sentence shows 'كريب' for كريب (فيلم 2014)")
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
  t.equal(
    doc.section('التفتح وتساقط الأوراق').sentences()[5].links()[1].page(),
    'زهرة (نبات)',
    "Willow-Ar: 'التفتح وتساقط الأوراق' section, 6th sentence links to 'زهرة (نبات)'"
  )
  t.equal(
    doc.sentences()[2].links()[0].text(),
    'نصف الكرة الشمالي',
    "Willow-Ar: 3rd sentence shows 'نصف الكرة الشمالي' for نصف الأرض الشمالي"
  )
  t.equal(
    doc.sentences()[9].text(),
    'استمرار الأجزاء النباتية الجافة على النبات يُعرف بمصطلح الاحتفاظ بالأجزاء الذابلة (Marcescence).',
    'Willow-Ar: 10th sentence text'
  )
  t.equal(doc.sections()[9].title(), 'الهجن والأصناف (Hybrids and cultivars)', 'Willow-Ar: section [9] title')
  t.equal(
    doc.section('أزهار الصفصاف').sentences()[0].links()[0].page(),
    'كأس الزهرة',
    "Willow-Ar: 'أزهار الصفصاف' section, 1st sentence links to 'كأس الزهرة'"
  )
  t.ok(
    doc.sentences()[28].text().startsWith('ويختلف توقيت ذلك باختلاف الموقع الجغرافي؛ فقد'),
    "Willow-Ar: 29th sentence starts 'ويختلف توقيت ذلك باختلاف الموق…'"
  )
  t.equal(doc.lists()[1].lines()[3].text(), 'الصفصاف الأسود', 'Willow-Ar: list 2, item 4')
  t.equal(
    doc.section('التفتح وتساقط الأوراق').sentences()[3].bolds()[0].text,
    'تساقط الأوراق في الخريف',
    "Willow-Ar: 'التفتح وتساقط الأوراق' section, 4th sentence bolds 'تساقط الأوراق في الخريف'"
  )
  t.equal(doc.images()[1].file(), 'File:Young-catkin.jpg', 'Willow-Ar: 2nd image file')
  t.equal(doc.categories()[6], 'نباتات طبية', 'Willow-Ar: 7th category')
  t.equal(
    doc.section('الهجن والأصناف (Hybrids and cultivars)').depth(),
    1,
    "Willow-Ar: 'الهجن والأصناف (Hybrids and cultivars)' is a depth-1 subsection"
  )
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
  t.equal(
    doc.sentences()[2].links()[0].page(),
    'جنيه إسترليني',
    "Wimbledon-Championships-Ar: 3rd sentence links to 'جنيه إسترليني'"
  )
  t.equal(
    doc.section('الجوائز المالية').sentences()[0].links()[0].text(),
    'جنيه استرليني',
    "Wimbledon-Championships-Ar: 'الجوائز المالية' section, 1st sentence shows 'جنيه استرليني' for جنيه إسترليني"
  )
  t.equal(
    doc.section('برامج البطولة').sentences()[0].text(),
    'تشمل البطولة 13 برنامجاً موزعة كالتالي:',
    "Wimbledon-Championships-Ar: 'برامج البطولة' section, 1st sentence text"
  )
  t.equal(doc.sections()[7].title(), 'معرض الصور', 'Wimbledon-Championships-Ar: section [7] title')
  t.equal(
    doc.section('الجوائز المالية').sentences()[0].links()[0].page(),
    'جنيه إسترليني',
    "Wimbledon-Championships-Ar: 'الجوائز المالية' section, 1st sentence links to 'جنيه إسترليني'"
  )
  t.equal(
    doc.tables()[1].rows()[5]['col1'],
    'الفائز بأكبر عدد من الألقاب في الزوجي المختلط',
    "Wimbledon-Championships-Ar: table 2, row 6, 'col1' column"
  )
  t.ok(
    doc.sentences()[2].text().startsWith('توزع جوائز مالية بإجمالي قدره 12,550,000 جنيه'),
    "Wimbledon-Championships-Ar: 3rd sentence starts 'توزع جوائز مالية بإجمالي قدره…'"
  )
  t.equal(
    doc.lists()[2].lines()[1].text(),
    'الفائزات بفردي سيدات ويمبلدون.',
    'Wimbledon-Championships-Ar: list 3, item 2'
  )
  t.equal(doc.sentences()[0].bolds()[0].text, 'ويمبلدون', "Wimbledon-Championships-Ar: 1st sentence bolds 'ويمبلدون'")
  t.equal(
    doc.images()[5].file(),
    'File:The_longest_match_ever_played_at_Wimbledon.jpg',
    'Wimbledon-Championships-Ar: 6th image file'
  )
  t.equal(doc.categories()[9], 'بطولات كرة مضرب كبرى', 'Wimbledon-Championships-Ar: 10th category')
  t.end()
})
