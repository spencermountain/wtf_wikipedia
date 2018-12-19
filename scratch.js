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


let str = `
The [[2007 Major League Baseball Draft|2007 MLB Draft]] was held on June 7&ndash;8. The Blue Jays had two first round picks, along with five compensation picks.
{| class="wikitable" style="font-size: 95%; text-align: center;"
|-
! style="background:#005ac0;" color:white;"| <span style="color:white;">Round</span>
! style="background:#005ac0;" color:white;"| <span style="color:white;">Pick</span>
! style="background:#005ac0;" color:white;"| <span style="color:white;">Player</span>
! style="background:#005ac0;" color:white;"| <span style="color:white;">Position</span>
! style="background:#005ac0;" color:white;"| <span style="color:white;">College/School</span>
! style="background:#005ac0;" color:white;"| <span style="color:white;">Nationality</span>
! style="background:#005ac0;" color:white;"| <span style="color:white;">Signed</span>
|-
!width="65"|
!width="45"|
! style="width:150px;"|
!width="60"|
! style="width:250px;"|
! style="width:100px;"|
! style="width:100px;"|
|-
| 1
| 16*
| [[Kevin Ahrens]]
| 3B
| [[Memorial High School (Hedwig Village, Texas)|Memorial High School]] ([[Texas|TX]])
| {{flagicon|United States}}
| 2007–06–15
|-
| 1
| 21
| [[J. P. Arencibia]]
| C
| [[Tennessee Volunteers baseball|Tennessee]]
| {{flagicon|United States}}
| 2007–06–15
|-
| C-A
| 38*
| [[Brett Cecil]]
| LHP
| [[Maryland Terrapins|Maryland]]
| {{flagicon|United States}}
| 2007–06–15
|}`;

let doc = wtf(str);
console.log(doc.tables(0).keyValue());
// console.log(wtf(str).templates());
// console.log(wtf(str).sections('roster').templates('mlbplayer'));
// console.log(doc.text());
// Alan Bean marriage template
