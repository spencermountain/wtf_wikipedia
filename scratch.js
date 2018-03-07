'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  let options = {};
  let r = wtf(str, options);
  console.log(r.sentences(13).text());
// r.images(0).exists().then(console.log);
// r.images(0).exists(console.log);
}


// from_file('list');
// from_file('bluejays');
// from_file('earthquakes');
// from_file('al_Haytham');
// from_file('redirect');
// from_file('raith_rovers');
// from_file('royal_cinema');
// from_file('Allen-R.-Morris');
// from_file('Toronto_Star');
// from_file('Toronto');
// from_file('royal_cinema');
// from_file('Radiohead');
// from_file('Jodie_Emery');
// from_file('Redirect')
// from_file("Africaans")
// from_file('K.-Nicole-Mitchell');
// from_file('United-Kingdom');
// from_file('Dollar-Point,-California');
// from_file('2008-British-motorcycle-Grand-Prix');

// wtf.fetch('Aldous Huxley', 'en', function(markup) {
//   var doc = wtf.fet(markup);
//   console.log(doc.images());
// });
// console.log(wtf(`pre-[[mirror stage]]`));
// wtf.fetch('Aldous Huxley', 'en').then((doc) => {
//   console.log(doc);
// });
// console.log(wtf(`i 'think' so`).toHtml());


console.log('|' + wtf('he is [[Spencer Kelly|so cool]] and [http://cool.com fresh]').toMarkdown());
