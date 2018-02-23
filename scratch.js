'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// function from_file(page) {
//   let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
//   let options = {
//     images: false,
//     categories: false,
//     citations: false,
//     infoboxes: false,
//   };
//   let r = wtf.parse(str, options);
//   console.log(r);
// }

// wtf.from_api('Hardi class destroyer', 'en', function(markup) {
//   var obj = wtf.parse(markup);
//   console.log(obj.sections[0].tables[0][0]);
// });
// from_file('list');
// from_file('bluejays');
// from_file('earthquakes');
// from_file('al_Haytham');
// from_file('redirect');
// from_file('Toronto');
// from_file('royal_cinema');
// from_file('Toronto_Star');
// from_file('royal_cinema');
// from_file('Radiohead');
// from_file('Jodie_Emery');
// from_file('Redirect')
// from_file("Africaans")
// from_file('K.-Nicole-Mitchell');
// from_file('United-Kingdom');


console.log(wtf.parse('{{age in days|27 May 2002}}').sections[0].sentences[0]);
