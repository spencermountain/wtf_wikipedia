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


let str = `{{Percent-done|done=13|total=33}}`;

let doc = wtf(str);
console.log(doc.text());
// console.log(wtf(str).tables(0).keyValue());
console.log(wtf(str).templates());

// Alan Bean marriage template
