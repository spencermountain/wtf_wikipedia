const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`Abraham Lincoln`, 'en');
//   // doc.html();
// })();



let str = `#REDIRECT [[Toronto_Blue_Jays#Stadium|Tranno]]`;
let doc = wtf(str);
// console.log(doc.redirects());
console.log(doc.html());
console.log(doc.markdown());
console.log(doc.latex());
// console.log(doc.json());
// console.log(doc.isRedirect());
