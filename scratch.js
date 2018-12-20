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


let str = `{{MLB game log|style={{Baseball primary style|New York Yankees}};|year=2018 Postseason|record= 2−3) (Home 1−2; Away 1−1}}

{{MLB game log section|hide=y|style={{Baseball secondary style|New York Yankees}};|section=American League Wild Card Game: 1−0 |stadium=y}}
|- bgcolor="bbffbb"
|[http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_03/gid_2018_10_03_oakmlb_nyamlb_1/boxscore_col.html 1]|| October 3 || [[2018 Oakland Athletics season|Athletics]] || 7–2 || '''[[Dellin Betances|Betances]]''' (1–0) || [[Liam Hendriks|Hendriks]] (0–1) || — || '''[[Yankee Stadium]]''' || 49,620 || 1−0
{{MLB game log section end}}

{{MLB game log section|hide=y|style={{Baseball secondary style|New York Yankees}};|section=American League Division Series: 1−3 (Home 0−2; Away 1−1)|stadium=y}}
|- bgcolor=#fbb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_05/gid_2018_10_05_nyamlb_bosmlb_1/boxscore_col.html 1] || October 5 || @ [[2018 Boston Red Sox season|Red Sox]] || 4−5 || [[Chris Sale|Sale]] (1–0) || '''[[J.A. Happ|Happ]]''' (0–1) || [[Craig Kimbrel|Kimbrel]] (1) || [[Fenway Park]] || 39,059 || 0–1
|- bgcolor=#bfb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_06/gid_2018_10_06_nyamlb_bosmlb_1/boxscore_col.html 2] || October 6 || @ [[2018 Boston Red Sox season|Red Sox]] || 6−2 || '''[[Masahiro Tanaka|Tanaka]]''' (1–0) || [[David Price (baseball)|Price]] (0–1) || — || [[Fenway Park]] || 39,151 || 1−1
|- bgcolor=#fbb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_08/gid_2018_10_08_bosmlb_nyamlb_1/boxscore_col.html 3] || October 8 || [[2018 Boston Red Sox season|Red Sox]] || 1−16 || [[Nathan Eovaldi|Eovaldi]] (1–0) || '''[[Luis Severino|Severino]]''' (0–1) || — || '''[[Yankee Stadium]]''' || 49,657 || 1−2
|- bgcolor=#fbb
| [http://gd2.mlb.com/content/game/mlb/year_2018/month_10/day_09/gid_2018_10_09_bosmlb_nyamlb_1/boxscore_col.html 4] || October 9 || [[2018 Boston Red Sox season|Red Sox]] || 3−4 || [[Rick Porcello|Porcello]] (1−0) || '''[[CC Sabathia|Sabathia]]''' (0−1) || [[Craig Kimbrel|Kimbrel]] (2) || '''[[Yankee Stadium]]''' || 49,641 || 1−3
{{MLB game log section end}}
{{end}}
`;
let doc = wtf(str);
// console.log(doc.tables(0));
console.log(wtf(str).templates());
// console.log(wtf(str).sections('roster').templates('mlbplayer'));
// console.log(doc.text());
// Alan Bean marriage template
