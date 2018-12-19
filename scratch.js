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


let str = `{| class="wikitable"
|-
| asdf
|-
| Name
| Country
| Rank
|-
| spencer || canada || captain
|-
| john || germany || captain
|-
| april || sweden || seargent
|-
| may || sweden || caption
|}`;
let doc = wtf(str);
console.log(doc.tables(0).json());
// // console.log(wtf(str).templates(0));
// console.log(doc.links());
// Alan Bean marriage template
