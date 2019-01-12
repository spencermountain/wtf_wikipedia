const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Troy Hill (Pittsburgh)');
//   // var doc = await wtf.random();
//   console.log(doc.json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });

//rowspan bug
// let str = `
// {|border="1" cellpadding="2" cellspacing="0" class="wikitable" style="text-align:center; width:100%;"
// |-style="background:#ddf"
// !width="4%"|#
// !width="11%"|Date
// !width="11%"|Opponent
// !width="8%"|Score
// !width="14%"|Win
// !width="14%"|Loss
// !width="14%"|Save
// !width="8%"|Attendance
// !width="5%"|Record
// !width="5%"|Streak
// |-style=background:#cfc
// |144||September 12 <small>(1)</small>||@ [[2018 New York Mets season|Mets]] || 0–13 || [[Zack Wheeler|Wheeler]] (11–7) || '''[[Trevor Richards (baseball)|Richards]]''' (3–9) || — || 20,423 || 57–87 ||L1
// |-style=background:#bbb
// |145||September 13 <small>(1)</small>||@ [[2018 New York Mets season|Mets]] || 3–4 || [[Jerry Blevins|Blevins]] (3–2) || '''[[Kyle Barraclough|Barraclough]]''' (0–6) || — || rowspan=2|22,640 || 57–88 || L2
// |-style=background:#fcc
// |146||September 13 <small>(2)</small>||@ [[2018 New York Mets season|Mets]] || 2–5 || [[Jason Vargas|Vargas]] (6–9) || '''[[Jeff Brigham|Brigham]]''' (0–2) || [[Robert Gsellman|Gsellman]] (11) || 57–89 || L3
// |-style=background:#fcc
// |147||September 14||@ [[2018 Philadelphia Phillies season|Phillies]] || 2–14 || [[Zach Eflin|Eflin]] (10–7) || '''[[Wei-Yin Chen|Chen]]''' (6–11) || — || 21,671 || 57–90 || L4
// |}
// `;
str = `{{Historical populations|35=1940|36=7319|37=1950|38=6530|39=1960|40=5141|41=1970|42=4205|43=1980|44=3251|45=1990|46=2742|47=2000|48=2540|49=2010|50=2714|type=USA|align-fn=center|source=PGHSNAP Census Data|footnote=}}`;

let doc = wtf(str);
console.log(doc.templates());
// console.log(doc.tables(0).keyValue());
// console.log(doc.images(0).json());
// console.log(wtf(str).sections('roster').templates('mlbplayer'));
// console.log(doc.text());
// Alan Bean marriage template
