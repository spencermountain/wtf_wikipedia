const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  var doc = await wtf.fetch('HSBC');
  // var doc = await wtf.random();
  console.log(doc.json());
})();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });


// let str = `{{columns-list|colwidth=15em|
// *[[Doug Acomb]]
// *[[Doug Adam]]
// *[[Gary Aldcorn]]
// *[[Mike Amodeo]]
// *[[John Anderson (ice hockey)|John Anderson]]
// *'''[[George Armstrong (ice hockey)|George Armstrong]]'''
// *[[Tim Armstrong (ice hockey)|Tim Armstrong]]
// *[[Earl Balfour]]
// }}`;
//
// let doc = wtf(str);
// console.log(doc.text());
// console.log(wtf(str).templates(0));

// Alan Bean marriage template
