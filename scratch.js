const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('2010_Toronto_Blue_Jays_season');
//   // var doc = await wtf.random();
//   console.log(doc.sections('regular season').json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });


// let str = `{|border="1" cellpadding="2" cellspacing="0" class="wikitable" style="text-align:center; width:100%;"
// |-style="background:#ddf"
// ! bgcolor="#DDDDFF" width="4%"  | #
// ! bgcolor="#DDDDFF" width="11%" | Date
// ! bgcolor="#DDDDFF" width="14%" | Opponent
// ! bgcolor="#DDDDFF" width="12%" | Score
// ! bgcolor="#DDDDFF" width="18%" | Win
// ! bgcolor="#DDDDFF" width="18%" | Loss
// ! bgcolor="#DDDDFF" width="14%" | Save
// ! bgcolor="#DDDDFF" width="8%"  | Attendance
// ! bgcolor="#DDDDFF" width="5%"  | Record
// ! bgcolor="#DDDDFF" width="5%"  | Streak
// |-
// | 20 || April 22 || [[2018 Kansas City Royals season|Royals]] || 5–8 || [[Kevin McCarthy (baseball)|McCarthy]] (1–0) || '''[[Drew VerHagen|VerHagen]]''' (0–1) || [[Kelvin Herrera|Herrera]] (4) || 19,034 || 9–11 || L1
// |-
// | 19
// || April 21
// || [[2018 Kansas City Royals season|Royals]]
// || 12–4
// || '''[[Mike Fiers|Fiers]]''' (2–1)
// || [[Danny Duffy|Duffy]] (0–3)
// || '''[[Warwick Saupold|Saupold]]''' (1)
// || 19,302
// || 9–10
// || W1
// |-
// | 22 || April 25 || @ [[2018 Pittsburgh Pirates season|Pirates]] || 3–8 || [[Chad Kuhl|Kuhl]] (3–1) || '''[[Matthew Boyd (baseball)|Boyd]]''' (0–2) || — || 9,396 || 10–12 || L1
// |}`;
let str = `{| class="wikitable"
|-
! h1
! h2
! h3
|-
| a
| aa
| aaa
|-
| b || bb || bbb
|-
| c || cc
|| ccc
|}`;
let doc = wtf(str);
console.log(doc.tables(0).keyValue());
// console.log(doc.templates());
// console.log(wtf(str).sections('roster').templates('mlbplayer'));
// console.log(doc.text());
// Alan Bean marriage template
