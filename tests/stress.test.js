'use strict';
var test = require('tape');
var fs = require('fs');
var path = require('path');
var wtf = require('./lib');

//read cached file
var fetch = function(file) {
  file = file.replace(/ /g, '-');
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
};

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
    'Magnar-Sætre',
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
    'toronto',
    'toronto_star'
  ];
  arr.forEach(title => {
    var markup = fetch(title);
    var doc = wtf.parse(markup);
    //basic is-valid tests for the page parsing
    t.ok(true, title);
    t.ok(doc.type === 'page', ' - - type:page');
    t.ok(doc.categories.length > 0, ' - - cat-length');
    t.ok(doc.sections.length > 0, ' - - section-length');
    var intro = doc.sections[0];
    t.ok(intro.title === '', ' - - intro-title-empty');
    t.ok(intro.depth === 0, ' - - depth=0');
    t.ok(intro.sentences.length > 0, ' - - sentences-length');
    t.ok(intro.sentences[0].text.length > 0, ' - - intro-text');
    t.ok(intro.sentences[0].text.match(/[a-z]/), ' - - intro-has words');

    var plain = wtf.plaintext(markup);
    t.ok(plain.length > 40, ' - - plaintext-length');
    t.ok(plain.match(/[a-z]/), ' - - plaintext-has words');
  });
  t.end();
});
