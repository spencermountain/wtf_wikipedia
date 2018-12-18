const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('HSBC');
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


let str = `the 30th pitcher in major league history to pitch an [[List of Major League Baseball pitchers who have struck out three batters on nine pitches|immaculate inning]].`;

let doc = wtf(str);
// console.log(doc.text());
// console.log(wtf(str).templates(0));
console.log(doc.links());
// Alan Bean marriage template
