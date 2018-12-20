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


let str = `{{MLB game log section|style={{Baseball secondary style|New York Yankees}}|stadium=y}}
|- bgcolor=#fbb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_05/gid_2018_10_05_nyamlb_bosmlb_1/boxscore_col.html 1] || October 5 || @ [[2018 Boston Red Sox season|Red Sox]] || 4−5 || [[Chris Sale|Sale]] (1–0) || '''[[J.A. Happ|Happ]]''' (0–1) || [[Craig Kimbrel|Kimbrel]] (1) || [[Fenway Park]] || 39,059 || 0–1
|- bgcolor=#bfb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_06/gid_2018_10_06_nyamlb_bosmlb_1/boxscore_col.html 2] || October 6 || @ [[2018 Boston Red Sox season|Red Sox]] || 6−2 || '''[[Masahiro Tanaka|Tanaka]]''' (1–0) || [[David Price (baseball)|Price]] (0–1) || — || [[Fenway Park]] || 39,151 || 1−1
{{MLB game log section end}}
`;
let doc = wtf(str);
// console.log(doc.tables(0));
console.log(wtf(str).templates(0).data);
// console.log(wtf(str).sections('roster').templates('mlbplayer'));
console.log(doc.text());
// Alan Bean marriage template
