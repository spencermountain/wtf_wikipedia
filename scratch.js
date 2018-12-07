const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('2009–10 Miami Heat season');
//   // var doc = await wtf.random();
//   console.log(doc.json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

wtf.fetch('Taylor%20Swift', 'en', {
  'Api-User-Agent': 'obfuscated@gmail.com'
}).then(docList => {
  console.warn(docList);
});


// let str = `{{Coord|42.774|-78.787|type:landmark|name=Buffalo Bills}}`;
// let doc = wtf(str);
// console.log(doc.text());
// console.log(wtf(str).tables(0).keyValue());
