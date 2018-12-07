const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Buzz Aldrin');
//   // var doc = await wtf.random();
//   console.log(doc.infobox(0).json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });


let str = `hello {{death date and age |1993|2|24 |1921|4|12 |df=yes}}`;
let doc = wtf(str);
console.log(doc.templates());
console.log(doc.text());
// console.log(wtf(str).tables(0).keyValue());

// Alan Bean marriage template
