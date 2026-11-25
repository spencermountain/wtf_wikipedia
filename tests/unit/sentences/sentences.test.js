import test from 'tape'
import wtf from '../../lib/index.js'

test('abbreviation-check', function (t) {
  const arr = [
    `known as J. Abrams.`,
    `known as J. J. Abrams.`,
    `known as '''J. J. Abrams'''`,
    `known as '''J. J. Abrams.'''`,
    `'''Dr.-Ing. h.c. F. Porsche AG''', usually shortened to '''Porsche AG''', is a German automobile manufacturer.`,
    `Dr.-Ing. h.c. F. Porsche AG, usually shortened to Porsche AG, is a German automobile manufacturer.`,
    `Prof. Dr.-Ing. Hans Müller lives in Berlin.`,
    `He earned a Dipl.-Ing. degree in 1995.`,
    `'''Dr.-Ing.''' is a German academic degree.`,
    `'''Foo. Bar''' is a thing.`,
  ]
  arr.forEach((str) => {
    const doc = wtf(str)
    t.equal(doc.sentences().length, 1, str)
  })
  const porsche = wtf(
    `'''Dr.-Ing. h.c. F. Porsche AG''', usually shortened to '''Porsche AG''', is a German automobile manufacturer. It is headquartered in Stuttgart.`
  )
  t.equal(porsche.sentences().length, 2, 'porsche two sentences')
  t.equal(
    porsche.sentences()[0].text(),
    'Dr.-Ing. h.c. F. Porsche AG, usually shortened to Porsche AG, is a German automobile manufacturer.',
    'porsche first sentence text preserves bold cleanup'
  )
  t.deepEqual(
    porsche
      .sentences()[0]
      .bolds()
      .map((b) => b.text),
    ['Dr.-Ing. h.c. F. Porsche AG', 'Porsche AG'],
    'porsche first sentence bolds'
  )
  const twoAfterBold = wtf(`'''Bold sentence.''' Next sentence.`)
  t.equal(twoAfterBold.sentences().length, 2, 'balanced bold still splits sentences')
  const longOpenBold = wtf(`'''${'x '.repeat(500)}end. Next sentence.`)
  t.equal(longOpenBold.sentences().length, 2, 'long unclosed bold still splits sentences')
  t.end()
})

test('tough sentence punctuation', function (t) {
  const arr = [
    `he is credited as '''Mr. Lawrence''' and sometimes '''Doug Lawrence'''.`,
    `he is credited as '''[[Mr. Lawrence]]''' and sometimes '''[[Doug Lawrence]]'''.`,
    `he is credited as [[Mr. Lawrence]] and sometimes Doug Lawrence.`,
    `he is credited as [http://cool.com Mr. Lawrence] and sometimes Doug Lawrence.`,
    `he is credited as {{asdf}}Mr. Lawrence and sometimes Doug Lawrence.`,
    `he is credited as Mr.{{asdf}} Lawrence and sometimes Doug Lawrence.`,
    // `he is credited as ([[Mr. Lawrence]]) and sometimes Doug Lawrence.`,
    // `he is credited as (''[[Mr. Lawrence]]'') and sometimes Doug Lawrence.`,
  ]
  arr.forEach((str, i) => {
    const doc = wtf(str)
    t.equal(
      doc.sentences()[0].text(),
      'he is credited as Mr. Lawrence and sometimes Doug Lawrence.',
      'tough-sentence #' + i
    )
  })
  t.end()
})

test('unicode sentences', function (t) {
  //cyrillic
  let str = `Соединённые Штаты Америки, штат Вайоминг, шестидесятые годы. Молодые парни Эннис Дел Мар и Джек Твист, выросшие на бедных ранчо в разных концах штата, знакомятся при устройстве на сезонную работу: их нанимают пасти овец на высокогорных летних пастбищах у Горбатой горы, вдали от обжитых мест. Однажды ночью после немалого количества выпитого виски, укрывшись от холода в одной палатке, они вступают в сексуальную связь. Так начинается их роман. `
  let arr = wtf(str).sentences()
  t.equal(arr.length, 4, 'four cyrillic sentences')

  //german
  str = `Yellow lkjsdfö. lkjsdfö`
  arr = wtf(str).sentences()
  t.equal(arr.length, 2, 'two german sentences')

  //japanese
  str = `前季より9つ勝ち星を増やし、30勝52敗でシーズンを終えた。順調に観戦客数も伸ばした。この年のドラフト1巡目2位で指名されたマーカス・キャンビーは期待外れに終わった。`
  arr = wtf(str).sentences()
  t.equal(arr.length, 3, 'three japanese sentences')
  t.end()
})

test('unicode paragraphs', function (t) {
  const str = `Соединённые Штаты Америки, штат Вайоминг, шестидесятые годы.

Yellow lkjsdfö.

  Так начинается их роман`
  const arr = wtf(str).paragraphs()
  t.equal(arr.length, 3, 'two cyrillic paragraphs')
  t.end()
})
