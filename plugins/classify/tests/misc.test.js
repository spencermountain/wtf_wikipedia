const test = require('tape')
const wtf = require('./_lib')
const fs = require('fs')
const path = require('path')

test('classify-test', async function(t) {
  let arr = [
    ['2008-British-motorcycle-Grand-Prix', 'Event'],
    ['Allen-R.-Morris', 'Person'],
    ['toronto_star', 'Organization'],
    ['Alsea-(company)', 'Organization/Company'],
    ['Antique-(band)', 'Organization/MusicalGroup'],
    ['raith_rovers', 'Organization/SportsTeam'],
    ['washington-nationals', 'Organization/SportsTeam'],
    ['Terrence-Murphy-(American-football)', 'Person/Athlete'],
    ['Altimont-Butler', 'Person/Athlete'],
    ['University-of-Nevada,-Reno-Arboretum', 'Place'],
    ['Bradley-(community),-Lincoln-County,-Wisconsin', 'Place'],
    ['Clint-Murchison-Sr.', 'Person'],
    ['Charlie-Milstead', 'Person/Athlete'],
    ['Gregory-Serper', 'Person'],
    ['United-Kingdom', 'Place'],
    ['Teymanak-e-Olya', 'Place'],
    ['toronto', 'Place/City'],
    ['royal_cinema', 'Place'],
    ['Canton-of-Etaples', 'Place'],
    ['Arts_Club_of_Chicago', 'Place'],
    ['Sara-C.-Bisel', 'Person'],
    ['al_Haytham', 'Person/Scientist'],
    ['Wendy-Mogel', 'Person'],
    ['The-Field-of-Waterloo', 'CreativeWork'],
    ['bluejays', null], //partial page
    ['Liste-der-argentinischen-Botschafter-in-Chile', null]
    // ['', '']
  ]
  // var arr = [
  // 'Altimont-Butler',
  // 'Anwar_Kamal_Khan',
  // 'Arts_Club_of_Chicago',
  // 'BBDO',
  // 'Bazooka',
  // 'Bodmin',
  // 'Britt-Morgan',
  // 'Canton-of-Etaples',
  // 'Chemical-biology',
  // 'Damphu-drum'
  // ]
  arr.forEach(a => {
    let abs = path.join(__dirname, `../../../tests/cache/${a[0]}.txt`)
    let txt = fs.readFileSync(abs).toString()
    let doc = wtf(txt)
    let res = doc.classify()
    t.equal(res.category, a[1], a[0])
  })

  t.end()
})
