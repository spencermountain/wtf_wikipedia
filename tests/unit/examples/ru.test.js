import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('Radiohead-Ru', (t) => {
  const doc = wtf(readPage('Radiohead-Ru'))
  t.match(doc.text(), /Radiohead/, 'Radiohead-Ru: band name')
  t.match(doc.text(), /OK Computer/, 'Radiohead-Ru: landmark album')
  t.ok(
    doc.links().some((link) => link.page() === 'Йорк, Том'),
    'Radiohead-Ru: lead singer link'
  )
  t.ok(doc.section('история'), 'Radiohead-Ru: biography or references section')
  t.ok(doc.references().length > 0, 'Radiohead-Ru: sources for the band history')
  t.match(doc.text(), /Kid A/, 'Radiohead-Ru: experimental album')
  t.ok(
    doc.categories().includes('Группы альтернативного рока Великобритании'),
    'Radiohead-Ru: Группы альтернативного рока Великобритании category'
  )
  t.equal(
    doc.section('Жанровая принадлежность').sentences()[6].links()[1].page(),
    'Британское вторжение',
    "Radiohead-Ru: 'Жанровая принадлежность' section, 7th sentence links to 'Британское вторжение'"
  )
  t.equal(
    doc.section('Значение').sentences()[5].links()[0].text(),
    '500 величайших альбомов всех времён по версии Rolling Stone',
    "Radiohead-Ru: 'Значение' section, 6th sentence shows '500 величайших альбомов всех времён по версии Rolling Stone' for 500 величайших альбомов всех времён по версии журнала Rolling Stone"
  )
  t.equal(
    doc.section('Жанровая принадлежность').sentences()[0].text(),
    'Музыку Radiohead обычно определяют как арт-рок и альтернативный рок.',
    "Radiohead-Ru: 'Жанровая принадлежность' section, 1st sentence text"
  )
  t.equal(doc.sections()[17].title(), 'Значение', 'Radiohead-Ru: section [17] title')
  t.equal(
    doc.sentences()[23].links()[1].page(),
    'Гринвуд, Колин',
    "Radiohead-Ru: 24th sentence links to 'Гринвуд, Колин'"
  )
  t.equal(
    doc.references()[38].title(),
    'Radiohead interview: The Golden Age of Radiohead',
    'Radiohead-Ru: 39th reference title'
  )
  t.ok(
    doc
      .section('The Bends и успех у критиков (1994—1995)')
      .sentences()[2]
      .text()
      .startsWith('Но сначала Леки попросил отложить работу в'),
    "Radiohead-Ru: 'The Bends и успех у критиков (1994—1995)' section, 3rd sentence starts 'Но сначала Леки попросил отлож…'"
  )
  t.equal(doc.lists()[3].lines()[4].text(), 'Amnesiac (2001);', 'Radiohead-Ru: list 4, item 5')
  t.equal(
    doc.section('Примечания').sentences()[1].bolds()[0].text,
    'Источники',
    "Radiohead-Ru: 'Примечания' section, 2nd sentence bolds 'Источники'"
  )
  t.equal(doc.images()[0].file(), 'File:abingdonschool.jpg', 'Radiohead-Ru: 1st image file')
  t.equal(doc.categories()[7], 'Исполнители Parlophone Records', 'Radiohead-Ru: 8th category')
  t.end()
})

test('Willow-Ru', (t) => {
  const doc = wtf(readPage('Willow-Ru'))
  t.match(doc.text(), /Salix/, 'Willow-Ru: Latin genus name')
  t.ok(
    doc.links().some((link) => link.page() === 'Древесные растения'),
    'Willow-Ru: botanical link'
  )
  t.ok(doc.section('ботаническое описание'), 'Willow-Ru: botanical section')
  t.ok(doc.images().length > 0, 'Willow-Ru: willow illustrations')
  t.ok(doc.categories().length > 0, 'Willow-Ru: botanical categories')
  t.ok(doc.categories().includes('Ива'), 'Willow-Ru: Ива category')
  t.ok(
    doc.links().some((link) => link.page() === 'Род (биология)'),
    'Willow-Ru: род (биология) link'
  )
  t.equal(
    doc.section('Ботаническое описание').sentences()[3].links()[0].page(),
    'Черешок',
    "Willow-Ru: 'Ботаническое описание' section, 4th sentence links to 'Черешок'"
  )
  t.equal(
    doc.section('Распространение и экология').sentences()[3].links()[0].text(),
    'деревья',
    "Willow-Ru: 'Распространение и экология' section, 4th sentence shows 'деревья' for Дерево"
  )
  t.equal(
    doc.section('Лесоводство ивы').sentences()[0].text(),
    'Из многочисленных видов и разновидностей ив в лесохозяйственном отношении заслуживают внимания:',
    "Willow-Ru: 'Лесоводство ивы' section, 1st sentence text"
  )
  t.equal(doc.sections()[14].title(), 'Синонимы', 'Willow-Ru: section [14] title')
  t.equal(doc.sentences()[3].links()[2].page(), 'Болото', "Willow-Ru: 4th sentence links to 'Болото'")
  t.equal(doc.references()[11].title(), 'Salix L.', 'Willow-Ru: 12th reference title')
  t.ok(
    doc.sentences()[17].text().startsWith('Верхушечная почка на ветвях обыкновенно отмирает, а'),
    "Willow-Ru: 18th sentence starts 'Верхушечная почка на ветвях об…'"
  )
  t.equal(
    doc.lists()[1].lines()[0].text(),
    'сплошную, или полевую, когда под неё отводится вся площадь, кроме канав и дорог;',
    'Willow-Ru: list 2, item 1'
  )
  t.equal(doc.sentences()[0].bolds()[0].text, 'И́ва', "Willow-Ru: 1st sentence bolds 'И́ва'")
  t.equal(doc.images()[3].file(), "File:Salix_fragilis_'Bullata'.jpg", 'Willow-Ru: 4th image file')
  t.equal(doc.categories()[3], 'Роды растений', 'Willow-Ru: 4th category')
  t.end()
})

test('Wimbledon-Championships-Ru', (t) => {
  const doc = wtf(readPage('Wimbledon-Championships-Ru'))
  t.match(doc.text(), /1877/, 'Wimbledon-Championships-Ru: first tournament year')
  t.ok(
    doc.links().some((link) => link.page() === 'Всеанглийский клуб лаун-тенниса и крокета'),
    'Wimbledon-Championships-Ru: tennis or venue link'
  )
  t.ok(doc.section('история'), 'Wimbledon-Championships-Ru: tournament history or programme section')
  t.ok(doc.tables().length > 0, 'Wimbledon-Championships-Ru: tournament records tables')
  t.ok(doc.references().length > 0, 'Wimbledon-Championships-Ru: tournament sources')
  t.ok(
    doc.links().some((link) => link.page() === 'Турниры Большого шлема (теннис)'),
    'Wimbledon-Championships-Ru: Турниры Большого шлема (теннис) link'
  )
  t.ok(doc.section('предшествующие события'), 'Wimbledon-Championships-Ru: Предшествующие события section')
  t.equal(
    doc.sentences()[34].links()[1].page(),
    'Джеймс Дуайт',
    "Wimbledon-Championships-Ru: 35th sentence links to 'Джеймс Дуайт'"
  )
  t.equal(
    doc.section('Предшествующие события').sentences()[7].links()[0].text(),
    'первоначальные правила лаун-тенниса,',
    "Wimbledon-Championships-Ru: 'Предшествующие события' section, 8th sentence shows 'первоначальные правила лаун-тенниса,' for История тенниса"
  )
  t.equal(
    doc.sentences()[27].text(),
    'К моменту проведения третьего чемпионата Всеанглийского клуба он уже не был единственным лаун-теннисным соревнованием в Великобритании.',
    'Wimbledon-Championships-Ru: 28th sentence text'
  )
  t.equal(doc.sections()[25].title(), 'См. также', 'Wimbledon-Championships-Ru: section [25] title')
  t.equal(
    doc.sentences()[39].links()[1].page(),
    'Баддели, Герберт',
    "Wimbledon-Championships-Ru: 40th sentence links to 'Баддели, Герберт'"
  )
  t.equal(
    doc.tables()[3].rows()[1]['круг'],
    '2-й круг квалификации',
    "Wimbledon-Championships-Ru: table 4, row 2, 'круг' column"
  )
  t.equal(doc.references()[26].title(), 'History - 1930s', 'Wimbledon-Championships-Ru: 27th reference title')
  t.ok(
    doc.section('Призовые суммы').sentences()[6].text().startsWith('На первом открытом Уимблдоне общая сумма призовых'),
    "Wimbledon-Championships-Ru: 'Призовые суммы' section, 7th sentence starts 'На первом открытом Уимблдоне о…'"
  )
  t.equal(
    doc.lists()[5].lines()[1].text(),
    'Профиль турнира на сайте WTA',
    'Wimbledon-Championships-Ru: list 6, item 2'
  )
  t.equal(
    doc.sentences()[0].bolds()[0].text,
    'Уимблдо́нский турни́р',
    "Wimbledon-Championships-Ru: 1st sentence bolds 'Уимблдо́нский турни́р'"
  )
  t.equal(
    doc.images()[3].file(),
    'File:Cars,_parking_at_the_wimbledon_championships_1906.jpg',
    'Wimbledon-Championships-Ru: 4th image file'
  )
  t.end()
})
