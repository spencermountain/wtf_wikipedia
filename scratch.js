const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`Abraham Lincoln`, 'en');
//   // doc.html();
// })();



let str = `:hello one
ok now you start`;
let doc = wtf(str);
console.log(doc.text());
