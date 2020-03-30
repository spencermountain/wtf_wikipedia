const test = require('tape')
const wtf = require('./_lib')
const fs = require('fs')
const path = require('path')

test('negative test', function(t) {
  let arr = [
    '2008-British-motorcycle-Grand-Prix',
    'Allen-R.-Morris',
    'toronto_star',
    'Alsea-(company)',
    'Antique-(band)',
    'raith_rovers',
    'Terrence-Murphy-(American-football)',
    'Altimont-Butler',
    'University-of-Nevada,-Reno-Arboretum',
    'Bradley-(community),-Lincoln-County,-Wisconsin',
    'Clint-Murchison-Sr.',
    'Charlie-Milstead',
    'Gregory-Serper',
    'United-Kingdom',
    'Teymanak-e-Olya',
    'toronto',
    'royal_cinema',
    'Canton-of-Etaples',
    'Arts_Club_of_Chicago',
    'al_Haytham',
    'The-Field-of-Waterloo',
    'bluejays',
    'Liste-der-argentinischen-Botschafter-in-Chile'
  ]
  arr.forEach(str => {
    let abs = path.join(__dirname, `../../../tests/cache/${str}.txt`)
    let txt = fs.readFileSync(abs).toString()
    let doc = wtf(txt)
    t.equal(doc.sfw().safe_for_work, true, str)
  })
  t.end()
})
