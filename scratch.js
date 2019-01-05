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


let str = `[[File:Wikipedesketch1.png|thumb|alt=A cartoon centipede detailed description.|The Wikipede edits ''[[Myriapoda]]''.]]`;

let doc = wtf(str);
// console.log(doc.tables(0).keyValue());
console.log(doc.images(0).json());
// console.log(wtf(str).sections('roster').templates('mlbplayer'));
// console.log(doc.text());
// Alan Bean marriage template
