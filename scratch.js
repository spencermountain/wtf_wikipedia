'use strict';
const wtf = require('./src/index');
// const wtf_wikipedia = require('./builds/wtf_wikipedia');
// const wtf_wikipedia = require('./build');
// let parse = wtf.parse;

// wtf.from_api("Tomb_Raider_(2013_video_game)", 'en', function(s) {
//   console.log(wtf_wikipedia.parse(s).infobox)
// })
//
// wtf.from_api('Raoul Dautry', 'fr',function(page) {
//   var parsed = wtf_wikipedia.parse(page); // causes the crash
//   console.log(parsed.text.get('Intro'));
// });

// function from_file(page){
//   let str = require('fs').readFileSync('./tests/cache/' + page.toLowerCase() + '.txt', 'utf-8');
//   // return wtf_wikipedia.plaintext(str)
//   return wtf_wikipedia.parse(str);
// }

// from_file("list")
// from_file("Toronto")
// from_file('Toronto_Star');
// from_file('royal_cinema');
// from_file("Jodie_Emery")
// from_file("Redirect")
// from_file("Africaans")
// from_file("Anarchism")

// wtf.from_api('Paris', 'en', function(markup) {
//   var obj = wtf.parse(markup);
//   console.log(obj);
// });

let str = `
===gdbserver===
hi there

===x===
Displays memory at the specified virtual address using the specified format.

===xp===
here too
`;
//and a fair amount of sunshine.{{sfn|Lawrence|Gondrand|2010|p=309}} Each year, however, there are a few days where the temperature rises above {{convert|32|C}}. Some years have even witnessed long periods of harsh summer weather, such as the [[2003 European heat wave|heat wave of 2003]] when temperatures exceeded {{convert|30|°C}} for weeks, surged up to {{convert|40|°C}} on some days and seldom cooled down at night.`;
console.log(wtf.parse(str).text.get('asdf'));
