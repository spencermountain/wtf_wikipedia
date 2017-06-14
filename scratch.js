'use strict';
const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
// let parse = wtf.parse;

// wtf.from_api("Tomb_Raider_(2013_video_game)", 'en', function(s) {
//   console.log(wtf.parse(s).infobox)
// })
//
// wtf.from_api('Raoul Dautry', 'fr',function(page) {
//   var parsed = wtf.parse(page); // causes the crash
//   console.log(parsed.text.get('Intro'));
// });

function from_file(page) {
  let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
  // console.log(wtf.plaintext(str));
  let r = wtf.parse(str, {});
  console.log(r.sections);
  // console.log(JSON.stringify(r.sections, null, 2));
}

// from_file("list")
// from_file("Toronto")
// from_file('Toronto_Star');
// from_file('royal_cinema');
// from_file('Jodie_Emery');
// from_file("Redirect")
// from_file("Africaans")
// from_file('Anarchism');

// wtf.from_api('Paris', 'en', function(markup) {
//   var obj = wtf.parse(markup);
//   console.log(obj);
// });

let str = `tony hawk [http://www.whistler.ca]`;
let doc = wtf.parse(str);
console.log(JSON.stringify(doc.sections, null, 2));
