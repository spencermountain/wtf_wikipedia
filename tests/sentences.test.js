var wtf = require('./lib')
var test = require('tape')

test('abbreviation-check', function(t) {
  var arr = [
    `known as J. Abrams.`,
    `known as J. J. Abrams.`,
    `known as '''J. J. Abrams'''`,
    `known as '''J. J. Abrams.'''`
  ]
  arr.forEach(str => {
    var doc = wtf(str)
    t.equal(doc.sentences().length, 1, str)
  })
  t.end()
})

test('tough sentence punctuation', function(t) {
  var arr = [
    `he is credited as '''Mr. Lawrence''' and sometimes '''Doug Lawrence'''.`,
    `he is credited as '''[[Mr. Lawrence]]''' and sometimes '''[[Doug Lawrence]]'''.`,
    `he is credited as [[Mr. Lawrence]] and sometimes Doug Lawrence.`,
    `he is credited as [http://cool.com Mr. Lawrence] and sometimes Doug Lawrence.`,
    `he is credited as {{asdf}}Mr. Lawrence and sometimes Doug Lawrence.`,
    `he is credited as Mr.{{asdf}} Lawrence and sometimes Doug Lawrence.`
    // `he is credited as ([[Mr. Lawrence]]) and sometimes Doug Lawrence.`,
    // `he is credited as (''[[Mr. Lawrence]]'') and sometimes Doug Lawrence.`,
  ]
  arr.forEach((str, i) => {
    var doc = wtf(str)
    t.equal(
      doc.sentences(0).text(),
      'he is credited as Mr. Lawrence and sometimes Doug Lawrence.',
      'tough-sentence #' + i
    )
  })
  t.end()
})

test('unicode sentences', function(t) {
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

test('unicode paragraphs', function(t) {
  let str = `Соединённые Штаты Америки, штат Вайоминг, шестидесятые годы.

Yellow lkjsdfö.

  Так начинается их роман`
  let arr = wtf(str).paragraphs()
  t.equal(arr.length, 3, 'two cyrillic paragraphs')
  t.end()
})
