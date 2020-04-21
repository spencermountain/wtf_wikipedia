var test = require('tape')
var wtf = require('./_lib')
var fs = require('fs')
var path = require('path')

function from_file(page) {
  var file = '../../../tests/cache/' + page + '.txt'
  file = path.join(__dirname, file)
  var str = fs.readFileSync(file, 'utf-8')
  return wtf(str)
}
module.exports = from_file

var pages = [
  '2008-British-motorcycle-Grand-Prix',
  'AACTA-Award-for-Outstanding-Achievement-in-Short-Film-Screen-Craft',
  'Alanine—oxo-acid-transaminase',
  'Alexander-Y-Type',
  'Allen-R.-Morris',
  'al_Haytham',
  'Alsea-(company)',
  'Altimont-Butler',
  'Antique-(band)',
  'Anwar_Kamal_Khan',
  'Arts_Club_of_Chicago',
  'BBDO',
  'Bazooka',
  'Bodmin',
  'Bradley-(community),-Lincoln-County,-Wisconsin',
  'Britt-Morgan',
  'Canton-of-Etaples',
  'Charlie-Milstead',
  'Chemical-biology',
  'Clint-Murchison-Sr.',
  'Damphu-drum',
  'Direct-representation',
  'Dollar-Point,-California',
  'Elizabeth-Gilbert',
  'Ewelina-Setowska-Dryk',
  'Goryeo-ware',
  'Gregory-Serper',
  'HMS-Irresistible',
  'Harry-McPherson',
  'History-of-rugby-union-matches-between-Scotland-and-Wales',
  'Irina-Saratovtseva',
  'Jerry-Mumphrey',
  'K.-Nicole-Mitchell',
  'Keilwelle',
  'Liste-der-argentinischen-Botschafter-in-Chile',
  'Magnar-Saetre',
  'Mark-Behr',
  'Maurische-Netzwuhle',
  'Mozilla-Firefox',
  'Neil-McLean-(saxophonist)',
  'RNDIS',
  'Remote-Application-Programming-Interface',
  'Remote-Data-Objects',
  'Remote-Data-Services',
  'Routing-and-Remote-Access-Service',
  'Runtime-Callable-Wrapper',
  'Sara-C.-Bisel',
  'Senate_of_Pakistan',
  'Terrence-Murphy-(American-football)',
  'Teymanak-e-Olya',
  'The-Atlas-(newspaper)',
  'The-Field-of-Waterloo',
  'Tour-EP-(Band-of-Horses-EP)',
  'University-of-Nevada,-Reno-Arboretum',
  'Wendy-Mogel',
  'africaans',
  'anarchism',
  'bluejays',
  'earthquakes',
  'jodie_emery',
  'list',
  'raith_rovers',
  // 'redirect',
  'rnli_stations',
  'royal_cinema',
  'statoil',
  'julia_kristeva',
  'toronto',
  'toronto_star'
]

test('try all pages', (t) => {
  pages.forEach((page) => {
    let doc = from_file(page)
    let wiki = doc.wikitext()
    t.ok(wiki && wiki.length > 5, page)
  })
  t.end()
})
