const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Jurassic Park (film)');
//   console.log(doc.infoboxes(0).keyValue());
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.markdown());

// var str = `one {{flag|USA}} two {{flag|DEU|empire}} three {{flag|CAN|name=Canadian}}`;
// var str = `hello {{flag|CAN|name=Canadian}} world 👍`;
var str = `{{flagicon|BUL}}`;

// str = `{{lang-ur|hello|asdf}}`;
let doc = wtf(str);
console.log(doc.text());
console.log(doc.links());
