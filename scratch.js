"use strict";
const wtf = require("./src/index");
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
  let str = require("fs").readFileSync("./tests/cache/" + page.toLowerCase() + ".txt", "utf-8");
  // console.log(wtf.plaintext(str));
  let r = wtf.parse(str, {});
  // console.log(r.tables);
  // console.log(JSON.stringify(r.sections, null, 2));
}

// from_file("list")
// from_file("earthquakes");
// from_file("bluejays");
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

// let str = `tony hawk [http://www.whistler.ca]`;
let str = `
{| border="1" cellpadding="2" cellspacing="0" class="wikitable"
|-
! bgcolor="#DDDDFF" width="4%" | #
|- align="center" bgcolor="ffbbbb"
| 1 || April 6 || @ [[Minnesota Twins|Twins]] || 6 - 1 || [[Brad Radke|Radke]] (1-0) || '''[[Pat Hentgen|Hentgen]]''' (0-1) || || 45,601 || 0-1
|- align="center" bgcolor="bbffbb"
| 2 || April 7 || @ [[Minnesota Twins|Twins]] || 9 - 3 || '''[[David Wells|Wells]]''' (1-0) || [[Mike Lincoln|Lincoln]] (0-1) || '''[[Roy Halladay|Halladay]]''' (1) || 9,220 || 1-1
|}
`;
let doc = wtf.parse(str);
console.log(JSON.stringify(doc.tables, null, 2));
