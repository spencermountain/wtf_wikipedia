const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('2016_NBA_Finals');
//   // var doc = await wtf.random();
//   console.log(doc.text());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });


let str = `* [[Hud (1986 film)|''Hud'' (1986 film)]], a 1986 Norwegian film`;

let doc = wtf(str);
console.log(doc.text());
// console.log(wtf(str).templates(0));
console.log(doc.links());
// Alan Bean marriage template
