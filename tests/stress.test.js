'use strict';
var test = require('tape');
var wtf = require('../src/index');

test('stress-test', t => {
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
    'Runtime Callable Wrapper'
  ];
  var done = 0;
  arr.forEach(title => {
    wtf.from_api(title, 'en', function(markup) {
      wtf.parse(markup);
      wtf.plaintext(markup);
      done += 1;
      t.ok(true, title);
      if (done >= arr.length) {
        t.end();
      }
    });
  });
});
