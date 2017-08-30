'use strict';
var test = require('tape');
var fs = require('fs');
var path = require('path');
var wtf = require('../src/index');

//read cached file
var fetch = function(file) {
  file = file.replace(/ /g, '-');
  return fs.readFileSync(path.join(__dirname, 'cache', file + '.txt'), 'utf-8');
};

test('stress-test-en', t => {
  var arr = [
    'Bodmin',
    'Anwar_Kamal_Khan',
    'Senate_of_Pakistan',
    'Irina Saratovtseva',
    'Antique (band)',
    'AACTA Award for Outstanding Achievement in Short Film Screen Craft',
    '2008 British motorcycle Grand Prix',
    'Goryeo ware',
    'Ewelina Sętowska-Dryk',
    'Canton of Étaples',
    'Gregory Serper',
    'Arts_Club_of_Chicago',
    'University of Nevada, Reno Arboretum',
    'Chemical biology',
    'Bradley (community), Lincoln County, Wisconsin',
    'Dollar Point, California',
    'The Field of Waterloo',
    'Direct representation',
    'Tour EP (Band of Horses EP)',
    'Alexander Y Type',
    'Alsea (company)',
    'Damphu drum',
    'Magnar Sætre',
    'Teymanak-e Olya',
    'Altimont Butler',
    'The Atlas (newspaper)',
    'Elizabeth Gilbert',
    'Neil McLean (saxophonist)',
    'Harry McPherson',
    'Charlie Milstead',
    'K. Nicole Mitchell',
    'Britt Morgan',
    'Allen R. Morris',
    'Jerry Mumphrey',
    'Clint Murchison Sr.',
    'Terrence Murphy (American football)',
    'History of rugby union matches between Scotland and Wales',
    'Alanine—oxo-acid transaminase',
    'Remote Application Programming Interface',
    'Remote Data Objects',
    'Remote Data Services',
    'RNDIS',
    'Routing and Remote Access Service',
    'Runtime Callable Wrapper',
    //german ones
    'Bazooka',
    'BBDO',
    'Liste der argentinischen Botschafter in Chile',
    'Mozilla Firefox',
    'HMS Irresistible',
    'Keilwelle',
    'Sara C. Bisel',
    'Wendy Mogel',
    'Maurische Netzwühle'
  ];
  arr.forEach(title => {
    var markup = fetch(title);
    var doc = wtf.parse(markup);
    t.ok(true, title);
    t.ok(doc.categories.length > 0, ' - - cat-length');
    t.ok(doc.sections.length > 0, ' - - section-length');
    var intro = doc.sections[0];
    t.ok(intro.sentences.length > 0, ' - - sentences-length');
    t.ok(intro.sentences[0].text.length > 0, ' - - intro-text');
    t.ok(intro.sentences[0].text.match(/[a-z]/), ' - - intro-has words');
  });
  t.end();
});
