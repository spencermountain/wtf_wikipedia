const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('List of Harvard Crimson men\'s ice hockey seasons');
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


let str = `{{Winning percentage|30|20|50|ignore_ties=y}}`;
let doc = wtf(str);
console.log(doc.text());
// // console.log(wtf(str).templates(0));
// console.log(doc.links());
// Alan Bean marriage template
