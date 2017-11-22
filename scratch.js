'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// function from_file(page) {
//   let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
//   let r = wtf.parse(str);
//   return r;
// }
// from_file('list');
// from_file("earthquakes");
// from_file('bluejays');
// from_file('redirect');
// from_file('Toronto');
// from_file('royal_cinema');
// from_file('Toronto_Star');
// from_file('Radiohead');
// from_file('Jodie_Emery');
// from_file('Redirect')
// from_file("Africaans")
// from_file('rnli_stations');

// wtf.from_api('Radiohead', 'en', function(markup) {
//   var obj = wtf.parse(markup);
//   console.log(obj.infoboxes[0].data);
// });

// var str = `hello {{myTempl|fun stuff!}} world`;
// var str = `hello {{main|fun}} world`;
// var str = `{{myTempl|cool data!}} Whistling is a sport in some countries...`;
// wtf.custom({
//   mine: (tmpl) => {
//     let m = tmpl.match(/^\{\{myTempl\|(.+?)\}\}$/);
//     if (m) {
//       return m[1];
//     }
//     return null;
//   }
// });
// console.log(wtf.parse(str));


console.log(wtf.parse('blha blah', {
  page_identifier: 234,
  lang_or_wikiid: 'de'
}));
