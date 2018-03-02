'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  let options = {};
  let r = wtf(str, options);
  console.log(r.infoboxes());
}

// wtf.from_api('Aldous Huxley', 'en', function(markup) {
//   var obj = wtf.fet(markup);
//   console.log(obj);
// });
// from_file('list');
// from_file('bluejays');
// from_file('earthquakes');
// from_file('al_Haytham');
// from_file('redirect');
from_file('raith_rovers');
// from_file('royal_cinema');
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


// console.log(wtf(`pre-[[mirror stage]]`));
// wtf.fetch('Aldous Huxley', 'en').then((doc) => {
//   console.log(doc);
// });

// wtf('that cat is [[a]] cool dude').toHtml();
