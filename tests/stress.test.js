var test = require('tape')
var readFile = require('./lib/_cachedPage')

function isCyclic(json) {
  var seenObjects = []
  function detect(obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true
      }
      seenObjects.push(obj)
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          // console.log(obj, 'cycle at ' + key)
          return true
        }
      }
    }
    return false
  }
  return detect(json)
}

test('stress-test-en', t => {
  var arr = [
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
  var noCitation = {
    list: true,
    africaans: true,
    'Sara-C.-Bisel': true,
    'Runtime-Callable-Wrapper': true,
    'Remote-Application-Programming-Interface': true,
    'Remote-Data-Services': true,
    'Neil-McLean-(saxophonist)': true,
    'Magnar-Saetre': true,
    'Liste-der-argentinischen-Botschafter-in-Chile': true,
    Keilwelle: true,
    'HMS-Irresistible': true,
    'Ewelina-Setowska-Dryk': true,
    'Alexander-Y-Type': true
  }
  arr.forEach(title => {
    var doc = readFile(title)
    //basic is-valid tests for the page parsing
    t.ok(true, title)
    t.equal(doc.isRedirect(), false, ' - - not-redirect')
    t.equal(doc.isDisambig(), false, ' - - not-disambiguation')
    t.ok(doc.categories().length > 0, ' - - cat-length')
    t.ok(doc.sections().length > 0, ' - - section-length')
    var intro = doc.sections(0)
    t.ok(intro.title() === '', ' - - intro-title-empty')
    t.ok(intro.indentation() === 0, ' - - depth=0')
    t.ok(intro.sentences().length > 0, ' - - sentences-length')
    t.ok(intro.sentences(0).text().length > 0, ' - - intro-text')
    t.ok(
      intro
        .sentences(0)
        .text()
        .match(/[a-z]/),
      ' - - intro-has words'
    )
    if (noCitation[title] === true) {
      t.equal(doc.citations().length, 0, title + ' has no citation')
    } else {
      t.ok(doc.citations().length > 0, title + ' has a citation')
    }
    var text = doc.text()
    t.ok(text.length > 40, ' - - text-length')

    var json = doc.json({
      encode: true
    })
    t.ok(Object.keys(json).length >= 2, ' - - json-keys-ok')
    t.equal(isCyclic(json), false, ' - - not-cyclic')
  })
  t.end()
})
